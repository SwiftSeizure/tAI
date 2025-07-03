from fastapi import APIRouter, Form
from backend.models import ChatResponse
from backend.models import ClientErrorResponse
from backend.dependencies import DBSession
from backend.database.chat import queryBot
from backend.database.schema import DBConversation, DBMessage, DBResponse

router = APIRouter(prefix="/chat", tags=["chat"])

@router.put("/{studentID}/{path}",response_model=ChatResponse,responses= {404:{"model": ClientErrorResponse}} 
           ,status_code=200, summary="Run query and update chat")
async def queryResponse(studentID: int, path: str, session:DBSession, query: str = Form(...)) -> ChatResponse:
    """Run a query and update the chat.

    Args:
        studentID (int): The ID of the student.
        path (str): TThe relative path of what context chat is being run in.
        query (str): The query to run.

    Returns:
        ChatResponse: The response containing the conversation ID and name.
    """
    # Placeholder for actual logic to run the query and update the chat

    ret = queryBot(studentID, path, query,session)

    return ChatResponse(studentID=studentID, conversationID=ret.conversationID,messages=ret.messages, responses=ret.responses)