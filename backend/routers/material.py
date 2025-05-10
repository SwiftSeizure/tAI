from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from backend.exceptions import FileNotFoundException, HTTPException
from backend.models import ClientErrorResponse
from backend.database import material as material_db
from backend.dependencies import DBSession
from pathlib import Path
import shutil
import mimetypes


router=APIRouter(prefix="/material", tags=["material"])
# Get the absolute path to one directory above the current file
BASE_DIR = Path(__file__).parent.parent.parent

@router.get("/{day_id}/{filename}",
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse},
                 403: {"model": ClientErrorResponse},
             },
            summary="Retrieve a file using a dayID and a file name.")
def get_file(dayID: int, filename: str):
    """ Retrieve a file using a dayID and a file name.

    Args:
        dayID (int): the ID of the day the file is associated with.
        filename (str): the name of the file to retrieve.

    Raises:
        HTTPException: 403 error if there is a path traversal attempt.
        FileNotFoundException: 404 error if the file is not found.

    Returns:
        FileResponse: fastapi response containing the file.
    """
    # Start from BASE_DIR and navigate to uploads
    file_path = BASE_DIR / "uploads" / "material" / str(dayID) / filename
    base_uploads = BASE_DIR / "uploads"
    
     # Security checks
    try:
        # Check if file exists and is within uploads directory
        if not file_path.is_file() or not file_path.resolve().is_relative_to(base_uploads.resolve()):
            raise FileNotFoundException(filename)
        
        # Check for path traversal attempts
        if '..' in str(file_path.relative_to(base_uploads)):
            raise HTTPException(status_code=403, error="invalid_path", message="Invalid path")
        
        mime_type, _ = mimetypes.guess_type(file_path)
        return FileResponse(
            path=file_path,
            media_type=mime_type or "application/octet-stream",
            filename=filename
        )
    except (ValueError, RuntimeError):
        raise FileNotFoundException(filename)

@router.post("/{dayID}/upload",
             status_code=201,
             responses={
                 403: {"model": ClientErrorResponse},
                 409: {"model": ClientErrorResponse},
                 500: {"model": ClientErrorResponse}
             },
             summary="Upload a file for a specific day")
async def upload_file(dayID: int, session: DBSession, file: UploadFile = File(...)):
    """Upload a file for a specific day.
    
    Args:
        dayID (int): The ID of the day to upload the file for
        file (UploadFile): The file to upload
        
    Raises:
        HTTPException: 403 if file type not allowed
        HTTPException: 409 if file already exists
        HTTPException: 500 if file save fails
        
    Returns:
        dict: Message confirming upload
    """
    # Define allowed file types
    ALLOWED_TYPES = {
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
    
    # Check file type
    content_type = file.content_type
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=403,
            error="invalid_file_type",
            message=f"File type {content_type} not allowed"
        )
    
    # Construct save path
    save_dir = BASE_DIR / "uploads" / "material" / str(dayID)
    save_path = save_dir / str(file.filename)
    
    # Create directory if it doesn't exist
    save_dir.mkdir(parents=True, exist_ok=True)
    
    # Check if file already exists
    if save_path.exists():
        raise HTTPException(
            status_code=409,
            error="duplicate_filename",
            message=f"File {file.filename} already exists"
        )
    
    try:
        # Save the file
        with save_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        path="dummy_path"  # Placeholder for path
        material_db.create_material(dayID, str(file.filename), path, session)  # Placeholder for session
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            error="file_save_failure",
            message=f"Failed to save file: {str(e)}"
        )
    
    return {"message": f"File {file.filename} uploaded successfully"}