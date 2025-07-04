from openai import OpenAI
from dotenv import load_dotenv
import os
from backend.models import ChatResponse,ClientErrorResponse, ChatMessage, ChatResponseMessage
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.database.schema import DBConversation,DBMessage, DBResponse
from backend.database.student import get_student
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException

load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



### TO DO take the path get the context and add it to the prompt
def queryBot(studentID :int, path: str, prompt: str, session:Session) -> ChatResponse:
    """
    Queries the OpenAI API with the given prompt and returns the response.
    
    Args:
        prompt (str): The prompt to send to the OpenAI API.
        
    Returns:
       str: The response from the OpenAI API.
    """

    

    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)


    stmnt = select(DBConversation).filter(
        DBConversation.studentID == studentID,
        DBConversation.path == path
     )
    conversation = session.execute(stmnt).scalar_one_or_none()
    


    try:
        chat_response = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
        {
            "role": "system",
            "content": "You are a teaching assistant. You must not give direct answers to questions under any circumstances."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]
)
        
        if not conversation:
            conversation = DBConversation(student=student, path=path)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
            conversationID = conversation.id
        else:
            conversationID = conversation.id

        message = DBMessage(
            content=prompt,
            conversationID=conversationID
        )
        response = DBResponse(
            content=chat_response.choices[0].message.content,
            conversationID=conversationID
        )
        session.add(message)
        session.add(response)
        session.commit()
        session.refresh(conversation)
        session.refresh(message)
        session.refresh(response)

        return ChatResponse(
    conversationID=conversation.id,
    studentID=studentID,
    messages=[ChatMessage.model_validate(m) for m in conversation.messages],
    responses=[ChatResponseMessage.model_validate(r) for r in conversation.responses]
)
    
    except Exception as e:
        raise InvalidClassCodeException() from e 




