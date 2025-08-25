from openai import OpenAI
from dotenv import load_dotenv
import os
from backend.models import ChatResponse,ClientErrorResponse, ChatMessage, ChatResponseMessage
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.database.schema import DBConversation,DBMessage, DBResponse
from backend.database.student import get_student
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException
from backend.routers.material import get_file
import mimetypes
import json

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
    try:
        context = get_file(1, path)
    except Exception as e:
        context = "No context given"

    formatted_context =  file_to_text("backend/uploads/material/1/" + path)

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
            "role": "system",
            "content": f"Here is relevant context for this conversation:\n\n{formatted_context}"
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
    
def file_to_text(path: str) -> str:
    mime, _ = mimetypes.guess_type(path)
    mime = mime or ""

    # Plaintext-ish files you can read directly
    if mime.startswith("text/") or path.lower().endswith((".md", ".py", ".js", ".ts", ".csv", ".log", ".env", ".yaml", ".yml")):
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()

    # JSON -> pretty string
    if path.lower().endswith(".json"):
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return json.dumps(json.load(f), indent=2)

    # PDF -> text (requires pdfminer.six or similar)
    if path.lower().endswith(".pdf"):
        from pdfminer.high_level import extract_text  # pip install pdfminer.six
        return extract_text(path)

    # DOCX -> text (requires python-docx)
    if path.lower().endswith(".docx"):
        from docx import Document  # pip install python-docx
        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs)

    # Fallback: bytes -> hex length notice (avoid sending binary)
    return f"[Unsupported/binary file: {path}]"




