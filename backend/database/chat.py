from openai import OpenAI
from dotenv import load_dotenv
import os, mimetypes, base64
from typing import Optional, Any
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
# Initialize OpenAI client only when configured; avoid crashing at import time
client: OpenAI | None = OpenAI(api_key=api_key) if api_key else None





def queryBot(studentID: str, path: Optional[str], prompt: str, session: Session) -> ChatResponse:
    """
    Queries the OpenAI API with the given prompt and returns the response.
    (DB logic unchanged; only OpenAI call is different.)
    path looks like uploads/assignment/1/assignment_1.pdf
    """

    print("Incoming path:", path)

    # Build assistant response if OpenAI is configured; otherwise fallback text
    assistant_text: str = ""

    if client is not None:
        # Build model input: instruction + prompt (+ file if provided)
        content_items: list[dict[str, str]] = [
            { "type": "input_text", "text": "You are a teachers assistant. you are never under any circumstances to directly tell students the answer. You may only help them understand the next step they need to take. You have been provied a file for context please reference it when answering questions." },
            { "type": "input_text", "text": prompt },
        ]

        if path is not None and isinstance(path, str) and len(path) > 0:
            remoteID = db_assignment.get_RemoteID(path, session) if path.startswith("uploads/assignment") else db_material.get_RemoteID(path, session)
            if remoteID is not None and isinstance(remoteID, str) and len(remoteID) > 0:
                content_items.insert(1, { "type": "input_file", "file_id": remoteID })

        openai_input: Any = [
            {
                "role": "user",
                "content": content_items
            }
        ]
        ai_response = client.responses.create(
            model="gpt-4.1",
            input=openai_input
        )

        try:
            assistant_text = ai_response.output_text
        except Exception:
            try:
                assistant_text = str(ai_response)
            except Exception:
                assistant_text = ""
    else:
        assistant_text = "Assistant is not configured. Please set OPENAI_API_KEY."



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


def generatePracticeQuestion(studentID: str, path: Optional[str], session: Session) -> dict[str, str]:
    """
    Generates a practice question based on the content at the given path.
    Does not save to conversation history.
    
    Args:
        studentID: The student's Firebase UID
        path: The path to the assignment/material file
        session: Database session
        
    Returns:
        dict with 'question' key containing the generated practice question
    """
    
    if client is None:
        return {"question": "Practice question generator is not configured. Please set OPENAI_API_KEY."}
    
    # Build content items for OpenAI
    content_items: list[dict[str, str]] = [
        { 
            "type": "input_text", 
            "text": "You are a helpful teacher's assistant. Generate a single practice question based on the provided content. The question should test understanding of key concepts without giving away answers. IMPORTANT: Format your response using proper Markdown syntax. For mathematical expressions, use LaTeX notation: inline math with $...$ and display math with $$...$$. For example: $x^2 + y^2 = z^2$ or $$\\int_0^1 x dx$$. Use proper formatting for lists, code blocks, and other content. Make the question clear and well-formatted for student practice."
        }
    ]
    
    # Add file context if path is provided
    if path is not None and isinstance(path, str) and len(path) > 0:
        remoteID = db_assignment.get_RemoteID(path, session) if path.startswith("uploads/assignment") else db_material.get_RemoteID(path, session)
        if remoteID is not None and isinstance(remoteID, str) and len(remoteID) > 0:
            content_items.append({ "type": "input_file", "file_id": remoteID })
    
    # Call OpenAI API
    openai_input: Any = [
        {
            "role": "user",
            "content": content_items
        }
    ]
    
    try:
        ai_response = client.responses.create(
            model="gpt-4.1",
            input=openai_input
        )
        
        try:
            question_text = ai_response.output_text
        except Exception:
            try:
                question_text = str(ai_response)
            except Exception:
                question_text = "Unable to generate practice question at this time."
    except Exception as e:
        print(f"Error generating practice question: {e}")
        question_text = "Unable to generate practice question at this time."
    
    return {"question": question_text}


def validatePracticeAnswer(studentID: str, path: Optional[str], question: str, answer: str, session: Session) -> dict[str, Any]:
    """
    Validates a student's answer to a practice question.
    
    Args:
        studentID: The student's Firebase UID
        path: The path to the assignment/material file
        question: The practice question that was asked
        answer: The student's answer
        session: Database session
        
    Returns:
        dict with 'is_correct' (bool) and 'feedback' (str) keys
    """
    
    if client is None:
        return {"is_correct": False, "feedback": "Answer validation is not configured. Please set OPENAI_API_KEY."}
    
    # Build content items for OpenAI
    content_items: list[dict[str, str]] = [
        { 
            "type": "input_text", 
            "text": f"""You are a helpful teacher's assistant evaluating a student's answer to a practice question.

Question: {question}

Student's Answer: {answer}

Evaluate if the student's answer is correct. Consider the answer correct if it demonstrates understanding of the key concept, even if the wording is slightly different. Be lenient with minor spelling or formatting issues.

Respond with ONLY a JSON object in this exact format:
{{"is_correct": true/false, "feedback": "brief feedback message"}}

If correct, provide encouraging feedback. If incorrect, provide a hint about what to consider without giving away the answer."""
        }
    ]
    
    # Add file context if path is provided
    if path is not None and isinstance(path, str) and len(path) > 0:
        remoteID = db_assignment.get_RemoteID(path, session) if path.startswith("uploads/assignment") else db_material.get_RemoteID(path, session)
        if remoteID is not None and isinstance(remoteID, str) and len(remoteID) > 0:
            content_items.append({ "type": "input_file", "file_id": remoteID })
    
    # Call OpenAI API
    openai_input: Any = [
        {
            "role": "user",
            "content": content_items
        }
    ]
    
    try:
        ai_response = client.responses.create(
            model="gpt-4.1",
            input=openai_input
        )
        
        try:
            response_text = ai_response.output_text
        except Exception:
            try:
                response_text = str(ai_response)
            except Exception:
                response_text = '{"is_correct": false, "feedback": "Unable to validate answer at this time."}'
        
        # Parse the JSON response
        import json
        try:
            result = json.loads(response_text)
            # Ensure the result has the required keys
            if "is_correct" not in result or "feedback" not in result:
                result = {"is_correct": False, "feedback": "Unable to validate answer at this time."}
        except json.JSONDecodeError:
            result = {"is_correct": False, "feedback": "Unable to validate answer at this time."}
            
    except Exception as e:
        print(f"Error validating practice answer: {e}")
        result = {"is_correct": False, "feedback": "Unable to validate answer at this time."}
    
    return result
