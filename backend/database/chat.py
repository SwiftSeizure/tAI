from openai import OpenAI
from dotenv import load_dotenv
import os, mimetypes, base64
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models import ChatResponse, ClientErrorResponse, ChatMessage, ChatResponseMessage
from backend.database.schema import DBConversation, DBMessage, DBResponse
from backend.database.student import get_student
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException
from backend.routers.material import get_file  # unchanged
from pathlib import Path

# Get the project root directory (3 levels up from this file)
ROOT_DIR = Path(__file__).parent.parent.parent

# Load .env file from project root
load_dotenv(ROOT_DIR / ".env")

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")
client = OpenAI(api_key=api_key)


RESPONSES_TEXT_MODEL = os.getenv("RESPONSES_TEXT_MODEL", "gpt-4.1-mini")
RESPONSES_VISION_MODEL = os.getenv("RESPONSES_VISION_MODEL", "gpt-4o-mini")

def _upload_file(path: str):
    return client.files.create(file=open(path, "rb"), purpose="user_data")  

def _png_to_data_url(path: str) -> str:
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    return f"data:image/png;base64,{b64}"

def _ask_with_pdf(file_id: str, prompt: str) -> str:
    resp = client.responses.create(
        model=RESPONSES_VISION_MODEL, 
        instructions="You are a teaching assistant. You must not give direct answers to questions under any circumstances.",
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": f"Use the attached PDF as context.\n\nQuestion: {prompt}"},
                {"type": "input_file", "file_id": file_id}
            ],
        }],
    )
    return resp.output_text

def _ask_with_txt_file_search(file_id: str, prompt: str) -> str:
    resp = client.responses.create(
        model=RESPONSES_TEXT_MODEL,

        instructions="You are a teaching assistant. You must not give direct answers to questions under any circumstances.",
        tools=[{"type": "file_search"}],
        attachments=[{"file_id": file_id, "tools": [{"type": "file_search"}]}],
        input=[{
            "role": "user",
            "content": [{"type": "input_text", "text": prompt}],
        }],
    ) # type: ignore
    return resp.output_text

def _ask_with_png_data_url(data_url: str, prompt: str) -> str:
    resp = client.responses.create(
        model=RESPONSES_VISION_MODEL,
        instructions="You are a teaching assistant. You must not give direct answers to questions under any circumstances.",
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": f"Use the attached image as context.\n\nQuestion: {prompt}"},
                {"type": "input_image", "image_url": data_url},
            ],
        }], # type: ignore
    )
    return resp.output_text

def queryBot(studentID: int, path: str, prompt: str, session: Session) -> ChatResponse:
    """
    Queries the OpenAI API with the given prompt and returns the response.
    (DB logic unchanged; only OpenAI call is different.)
    """
    
    ### TODO: Change hardcode file path to dynamic path 
    full_path = os.path.join("uploads", "material", "1", path)
    mime, _ = mimetypes.guess_type(full_path)
    ext = (os.path.splitext(full_path)[1] or "").lower()

    try:
        if not os.path.exists(full_path):
            response_text = "[Context file not found]"
        elif (ext == ".pdf") or (mime == "application/pdf"):
            uploaded = _upload_file(full_path)
            response_text = _ask_with_pdf(uploaded.id, prompt)
        elif (ext == ".txt") or (mime == "text/plain"):
            uploaded = _upload_file(full_path)
            response_text = _ask_with_txt_file_search(uploaded.id, prompt)
        elif (ext == ".png") or (mime == "image/png"):
            try:
                _upload_file(full_path)
            except Exception:
                pass
            data_url = _png_to_data_url(full_path)
            response_text = _ask_with_png_data_url(data_url, prompt)
        else:
            response_text = "[Unsupported file type for direct scanning. Please use PDF, TXT, or PNG.]"
    except Exception as e:
        response_text = f"[Failed to process file: {e}]"

    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)

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
        response = DBResponse(content=response_text, conversationID=conversationID)

        session.add(message)
        session.add(response)
        session.commit()
        session.refresh(conversation)
        session.refresh(message)
        session.refresh(response)

        return ChatResponse(
            conversationID=conversation.id, # type: ignore
            studentID=studentID,
            messages=[ChatMessage.model_validate(m) for m in conversation.messages],
            responses=[ChatResponseMessage.model_validate(r) for r in conversation.responses],
        )

    except Exception as e:
        raise InvalidClassCodeException() from e
