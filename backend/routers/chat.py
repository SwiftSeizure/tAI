from fastapi import APIRouter, Form
from backend.models import ChatResponse
from backend.models import ClientErrorResponse
from backend.dependencies import DBSession
from backend.database.chat import queryBot, generatePracticeQuestion, validatePracticeAnswer
from backend.database.schema import DBConversation, DBMessage, DBResponse

from typing import Annotated
from backend.exceptions import UnauthorizedException
from fastapi import Depends
from backend.auth import get_firebase_user_from_token

router = APIRouter(prefix="/chat", tags=["chat"])

@router.put("/{path:path}",response_model=ChatResponse,responses= {404:{"model": ClientErrorResponse}} 
           ,status_code=200, summary="Run query and update chat")
async def queryResponse(studentID: str, 
                        path: str, 
                        user: Annotated[dict, Depends(get_firebase_user_from_token)],
                        session:DBSession,
                        query: str = Form(...)) -> ChatResponse:
    """Run a query and update the chat.

    Args:doc_validator.validate_file(file)

        studentID (str): The ID of the student (Firebase UID).
        path (str): The relative path of what context the chat is being run in.
        query (str): The query to run.

    Returns:
        ChatResponse: The response containing the conversatiorint(path)n ID and name.
    """
    

    ret = queryBot(studentID,path, query,session)

    return ChatResponse(studentID=studentID, conversationID=ret.conversationID,messages=ret.messages, responses=ret.responses)


@router.get("/practice-question/{path:path}", 
           response_model=dict,
           responses={404: {"model": ClientErrorResponse}},
           status_code=200, 
           summary="Generate a practice question based on content")
async def getPracticeQuestion(
    studentID: str,
    path: str,
    user: Annotated[dict, Depends(get_firebase_user_from_token)],
    session: DBSession
) -> dict[str, str]:
    """Generate a practice question based on the content at the given path.
    
    Args:
        studentID (str): The ID of the student (Firebase UID).
        path (str): The relative path of the content to generate a question from.
        
    Returns:
        dict: A dictionary with a 'question' key containing the generated practice question.
    """
    
    result = generatePracticeQuestion(studentID, path, session)
    return result


@router.post("/validate-practice-answer/{path:path}", 
            response_model=dict,
            responses={404: {"model": ClientErrorResponse}},
            status_code=200, 
            summary="Validate a student's answer to a practice question")
async def validateAnswer(
    studentID: str,
    path: str,
    user: Annotated[dict, Depends(get_firebase_user_from_token)],
    session: DBSession,
    question: str = Form(...),
    answer: str = Form(...)
) -> dict:
    """Validate a student's answer to a practice question.
    
    Args:
        studentID (str): The ID of the student (Firebase UID).
        path (str): The relative path of the content.
        question (str): The practice question that was asked.
        answer (str): The student's answer.
        
    Returns:
        dict: A dictionary with 'is_correct' (bool) and 'feedback' (str) keys.
    """
    
    result = validatePracticeAnswer(studentID, path, question, answer, session)
    return result