import openai
from dotenv import load_dotenv
import os
from backend.models import ChatResponse
from sqlalchemy import select,filter
from sqlalchemy.orm import Session
from backend.database.schema import DBConversation,DBMessage, DBResponse
from backend.database.student import get_student
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def queryResponse(studentID :int, path: str, prompt: str, session:Session) -> ChatResponse:
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
        DBConversation.student == studentID,
        DBConversation.path == path
     )
    conversation = session.execute(stmnt).scalar_one_or_none()
    


    try:
        response = openai.ChatCompletion.create( # type: ignore
        model="gpt-4-1106-preview",
        messages=[
            {
                "role": "system",
                "content": "You are a teaching assistant. You must not give direct answers to questions under any circumstances. Please refer to the following file to understand what class you are TA'ing and to cite relevant materials/questions. Here is the text: P.E.M.D.A.S. 1) Solve inside the parenthesis. 2) Exponents 3) Multiplication and Division, from left to right 4) Addition and Subtraction, from left to right"
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
        
        if not conversation:
            conversation = DBConversation(student=studentID, path=path)
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
            content=response.choices[0].message.content,
            conversationID=conversationID
        )
        session.add(message)
        session.add(response)
        session.commit()
        session.refresh(message)
        session.refresh(response)


        return ChatResponse() 
    except Exception as e:
        return 
        




