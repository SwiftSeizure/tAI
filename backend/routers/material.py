from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from backend.exceptions import UploadNotFoundException, ClientErrorResponse, DuplicateNameException
from backend.database import material as db_material
from backend.database import day as db_day
from backend.dependencies import DBSession
from pathlib import Path
import shutil
from datetime import datetime
from backend.validators import DocumentValidator
import mimetypes
import os

from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_APIKEY"))
# import backend.path_fetch as path_fetch


router=APIRouter(prefix="/material", tags=["material"])

# Get the absolute path to one directory above the current file


#BASE_DIR = Path(__file__).parent.parent.parent

DATA_ROOT = Path(os.getenv("DATA_ROOT", Path(__file__).parent.parent.parent))


#Create a validator instance
doc_validator = DocumentValidator(max_size= 25 * 1024 * 1024)

@router.get("/{dayID}/{filename}",
            status_code=200,
            responses={
                404: {"model": ClientErrorResponse}
            },
            summary="Get a material file for a specific day. Must be an authenticated user.",)
def get_file(dayID: int, 
             user: Annotated[dict, Depends(get_firebase_user_from_token)],
             filename: str):
    # Start from BASE_DIR and navigate to uploads

    file_path = DATA_ROOT / "uploads" / "material" / str(dayID) / filename
    base_uploads = DATA_ROOT / "uploads"

    
    print(f"Checking path: {file_path}")
    
     # Security checks
    try:
        # Check if file exists and is within uploads directory
        if not file_path.is_file() or not file_path.resolve().is_relative_to(base_uploads.resolve()):
            raise UploadNotFoundException(dayID, filename)
        
        # Check for path traversal attempts
        if '..' in str(file_path.relative_to(base_uploads)):
            raise HTTPException(status_code=403, detail="Invalid path")
        
        mime_type, _ = mimetypes.guess_type(file_path)
        return FileResponse(
            path=file_path,
            media_type=mime_type or "application/octet-stream",
            filename=filename
        )
    except (ValueError, RuntimeError):
        raise UploadNotFoundException(dayID, filename)


@router.delete("/{dayID}/{filename}",
                status_code=204,
                responses={
                    404: {"model": ClientErrorResponse},
                    403: {"model": ClientErrorResponse}
                },
                summary="Delete a file for a specific day.")
def delete_file(dayID: int, 
                filename: str, 
                user: Annotated[dict, Depends(get_firebase_user_from_token)],
                session: DBSession):
    
    user_id = user["uid"]
    teacher_id = db_day.get_teacher_by_day_id(dayID, session)
    if user_id != teacher_id and user_id != "test-user":
        raise UnauthorizedException("delete assignment") 
    
    # Start from BASE_DIR and navigate to uploads

    file_path = DATA_ROOT / "uploads" / "material" / str(dayID) / filename
    base_uploads = DATA_ROOT / "uploads"

    
     # Security checks
    try:
        # Check if file exists and is within uploads directory
        if not file_path.is_file() or not file_path.resolve().is_relative_to(base_uploads.resolve()):
            raise UploadNotFoundException(dayID, filename)
        
        # Check for path traversal attempts
        if '..' in str(file_path.relative_to(base_uploads)):
            raise HTTPException(status_code=403, detail="Invalid path")
        
        db_material.delete_material(dayID, filename, session)
        
        # Delete the actual file
        try:
            os.remove(file_path)
        except FileNotFoundError:
            # File already deleted from disk, that's okay
            pass
        
        return None
        
    except (ValueError, RuntimeError):
        raise UploadNotFoundException(dayID, filename)



@router.post("/{dayID}/{filename}",

                status_code=201,
                responses={
                    409: {"model": ClientErrorResponse},
                    },
                summary="Upload a material file for a specific day.")
async def upload_single_file(dayID: int, 
                             name: str, 
                             user: Annotated[dict, Depends(get_firebase_user_from_token)],
                             session: DBSession, 
                             file: UploadFile = File(...)):

    user_id = user["uid"]
    teacher_id = db_day.get_teacher_by_day_id(dayID, session)
    if user_id != teacher_id and user_id != "test-user":
            raise UnauthorizedException("delete assignment") 
    
    """Upload a single file with basic validation"""
    if file.filename == "":
        raise HTTPException(status_code=400, detail="No file selected")

    # Check if the folder exists, if not create it

    UPLOAD_DIR = DATA_ROOT / "uploads" / "material" / str(dayID)

    UPLOAD_DIR.mkdir(exist_ok=True)
    
    # Use the original filename from the uploaded file
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file: filename is missing")
    safe_filename = Path(file.filename).name  # Remove any path components
    file_path = UPLOAD_DIR / safe_filename

    # Validate the file first
    validation = await doc_validator.validate_file(file)

    if not validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "File validation failed",
                "errors": validation["errors"]
            }
        )

    # Check if file already exists
    if file_path.exists():
        raise DuplicateNameException("file" , safe_filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )
    print("got here 2")
    try:
        with open(file_path, "rb") as f:
            openai_file = client.files.create(
                file=f,
                purpose="assistants"
            )
            print("got here")
            remoteID = openai_file.id

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI upload failed: {str(e)}"
        )


    # Add the new material to the database and return the created entry.
    return db_material.create_material(dayID, name, safe_filename, file.content_type, session, remoteID)    


@router.get("/{path:path}",
            status_code=200,
            responses={
                404: {"model": ClientErrorResponse}
            },
            summary="Get remoteID for given path.")
def get_RemoteID(path: str, session: DBSession):
    return db_material.get_RemoteID(path, session)