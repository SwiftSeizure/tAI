from openai import OpenAI
from dotenv import load_dotenv
import os, mimetypes, base64
from sqlalchemy import select
from sqlalchemy.orm import Session
import PyPDF2

from backend.models import ChatResponse, ClientErrorResponse, ChatMessage, ChatResponseMessage
from backend.database.schema import DBConversation, DBMessage, DBResponse
from backend.database.student import get_student
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException
from backend.routers.material import get_file  # unchanged

import backend.database.assignment as db_assignment
import backend.database.material as db_material


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")
client = OpenAI(api_key=api_key)





def queryBot(studentID: str, path: str, prompt: str, session: Session) -> ChatResponse:
    """
    Queries the OpenAI API with the given prompt and returns the response.
    (DB logic unchanged; only OpenAI call is different.)
    path looks like uploads/assignment/1/assignment_1.pdf
    """

    print("Incoming path:", path)

    remoteID = db_assignment.get_RemoteID(path, session) if path.startswith("uploads/assignment") else db_material.get_RemoteID(path, session)


    ai_response = client.responses.create(
    model="gpt-4.1",
    input=[
        {
            "role": "user",
            "content": [
                { "type": "input_text", "text": "You are a teachers assistant. you are never under any circumstances to directly tell students the answer. You may only help them understand the next step they need to take. You have been provied a file for context please reference it when answering questions." },
                {
                    "type": "input_file",
                    "file_id": f"{remoteID}"
                },
                { "type": "input_text", "text": prompt }
            ]
        }
    ]
)    



    student = get_student(studentID, session) #type: ignore
    if not student:
        raise EntityNotFoundException("student", studentID) # type: ignore

    stmnt = select(DBConversation).filter(
        DBConversation.studentID == studentID,
        DBConversation.path == path
    )
    conversation = session.execute(stmnt).scalar_one_or_none()

    try:
        if not conversation:
            conversation = DBConversation(student=student, path=path)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
            conversationID = conversation.id
        else:
            conversationID = conversation.id

        message = DBMessage(content=prompt, conversationID=conversationID)

        # Extract assistant text from OpenAI response; fallback to string coercion if needed
        try:
            assistant_text = ai_response.output_text
        except Exception:
            try:
                assistant_text = str(ai_response)
            except Exception:
                assistant_text = ""

        db_response = DBResponse(content=assistant_text, conversationID=conversationID)

        session.add(message)
        session.add(db_response)
        session.commit()
        session.refresh(conversation)
        session.refresh(message)
        session.refresh(db_response)

        return ChatResponse(
            conversationID=conversation.id, # type: ignore
            studentID=studentID,
            messages=[ChatMessage.model_validate(m) for m in conversation.messages],
            responses=[ChatResponseMessage.model_validate(r) for r in conversation.responses],
        )

    except Exception as e:
        raise InvalidClassCodeException() from e
