from fastapi import APIRouter, Form
from backend.models import ChatResponse
from backend.models import ClientErrorResponse
from backend.dependencies import DBSession
from backend.database.chat import queryBot
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