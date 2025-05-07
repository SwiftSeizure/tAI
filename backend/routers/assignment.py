from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from backend.exceptions import FileNotFoundException
from pathlib import Path
import mimetypes
# import backend.path_fetch as path_fetch

router=APIRouter(prefix="/assignment", tags=["assignment"])
# Get the absolute path to one directory above the current file
BASE_DIR = Path(__file__).parent.parent.parent

@router.get("/{day_id}/{filename}")
def get_file(day_id: int, filename: str):
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
    file_path = BASE_DIR / "uploads" / "assignment" / str(day_id) / filename
    base_uploads = BASE_DIR / "uploads"
    
    print(f"Checking path: {file_path}")
    
     # Security checks
    try:
        # Check if file exists and is within uploads directory
        if not file_path.is_file() or not file_path.resolve().is_relative_to(base_uploads.resolve()):
            raise FileNotFoundException(filename)
        
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
        raise FileNotFoundException(filename)
    """
    # Debug logging
    print(f"Looking for file: {filename} in day: {day_id}")
    path = path_fetch.get_safe_path("assignment", day_id, filename)
    print(f"Resolved path: {path}")
    return FileResponse(path=path, filename=filename)
    """