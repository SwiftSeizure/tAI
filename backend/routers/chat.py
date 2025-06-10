from fastapi import APIRouter, Form
from backend.models import ChatResponse
from backend.models import ClientErrorResponse

router = APIRouter(prefix="/chat", tags=["chat"])

router.put("/{studentID}/{path}",response_model=ChatResponse,responses= {404:{"model": ClientErrorResponse}} 
           ,status_code=200, summary="Run query and update chat")
async def run_query(studentID: int, path: str, query: str = Form(...)) -> ChatResponse:
    """Run a query and update the chat.

    Args:
        studentID (int): The ID of the student.
        path (str): TThe relative path of what context chat is being run in.
        query (str): The query to run.

    Returns:
        ChatResponse: The response containing the conversation ID and name.
    """
    # Placeholder for actual logic to run the query and update the chat

    return ChatResponse(conversationID=1, name="Sample Conversation")