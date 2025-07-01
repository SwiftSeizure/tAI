from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from backend.exceptions import UploadNotFoundException, ClientErrorResponse
from backend.database import assignment as db_assignment
from backend.dependencies import DBSession
from pathlib import Path
import mimetypes
import os
# import backend.path_fetch as path_fetch

router=APIRouter(prefix="/assignment", tags=["assignment"])
# Get the absolute path to one directory above the current file
BASE_DIR = Path(__file__).parent.parent.parent

@router.get("/{dayID}/{filename}")
def get_file(dayID: int, filename: str):
    """ Retrieve a file for a given assigment.
    
    Args:
        day_id (int): The ID of the day to retrieve the file for.
        filename (str): The name of the file to retrieve.
        
    Raises:
        FileNotFoundException: If the file is not found or if there is a path traversal attempt.
        
    Returns:
        FileResponse: A response containing the file.
    """
    # Start from BASE_DIR and navigate to uploads
    file_path = BASE_DIR / "uploads" / "assignment" / str(dayID) / filename
    base_uploads = BASE_DIR / "uploads"
    
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
    """
    # Debug logging
    print(f"Looking for file: {filename} in day: {day_id}")
    path = path_fetch.get_safe_path("assignment", day_id, filename)
    print(f"Resolved path: {path}")
    return FileResponse(path=path, filename=filename)
    """
    

@router.delete("/{dayID}/{filename}",
                status_code=204,
                responses={
                    404: {"model": ClientErrorResponse},
                    403: {"model": ClientErrorResponse}
                },
                summary="Delete an assignment file for a specific day.")
def delete_file(dayID: int, filename: str, session: DBSession):
    """Delete an assignment file and its database entry.
    
    Args:
        dayID (int): The ID of the day the assignment belongs to
        filename (str): The name of the file to delete
        session (DBSession): Database session
        
    Raises:
        FileNotFoundException: If the file doesn't exist
        HTTPException: If there's a path traversal attempt
        
    Returns:
        None
    """
    print("=== Starting delete operation ===")  # Add this
    
    file_path = BASE_DIR / "uploads" / "assignment" / str(dayID) / filename
    base_uploads = BASE_DIR / "uploads"
    
    print(f"Checking path: {file_path}")  # Add this
    print(f"Base uploads: {base_uploads}")  # Add this
    
    try:
        # Security checks
        if not file_path.is_file() or not file_path.resolve().is_relative_to(base_uploads.resolve()):
            print(f"File does not exist: {file_path}")  # Add this
            raise UploadNotFoundException(dayID, filename)
        
        if '..' in str(file_path.relative_to(base_uploads)):
            raise HTTPException(status_code=403, detail="Invalid path")
        
        # Delete from database first
        db_assignment.delete_assignment(dayID, filename, session)
        
        # Then delete the file from disk
        try:
            os.remove(file_path)
        except FileNotFoundError:
            # File already deleted from disk, that's okay
            pass
        
        return None
        
    except (ValueError, RuntimeError):
        raise UploadNotFoundException(dayID, filename)