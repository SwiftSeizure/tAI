from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from backend.exceptions import FileNotFoundException, ClientErrorResponse
from backend.database import material as db_material
from backend.dependencies import DBSession
from pathlib import Path
import mimetypes
import os
# import backend.path_fetch as path_fetch

router=APIRouter(prefix="/material", tags=["material"])
# Get the absolute path to one directory above the current file
BASE_DIR = Path(__file__).parent.parent.parent

@router.get("/{day_id}/{filename}")
def get_file(day_id: int, filename: str):
    # Start from BASE_DIR and navigate to uploads
    file_path = BASE_DIR / "uploads" / "material" / str(day_id) / filename
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



router.delete("/{day_id}/{filename}",
                status_code=204,
                responses={
                    404: {"model": ClientErrorResponse},
                    403: {"model": ClientErrorResponse}
                },
                summary="Delete a file for a specific day.")
def delete_file(day_id: int, filename: str, session: DBSession):
    # Start from BASE_DIR and navigate to uploads
    file_path = BASE_DIR / "uploads" / "material" / str(day_id) / filename
    base_uploads = BASE_DIR / "uploads"
    
     # Security checks
    try:
        # Check if file exists and is within uploads directory
        if not file_path.is_file() or not file_path.resolve().is_relative_to(base_uploads.resolve()):
            raise FileNotFoundException(filename)
        
        # Check for path traversal attempts
        if '..' in str(file_path.relative_to(base_uploads)):
            raise HTTPException(status_code=403, detail="Invalid path")
        
        db_material.delete_material(day_id, filename, session)
        
        # Delete the actual file
        try:
            os.remove(file_path)
        except FileNotFoundError:
            # File already deleted from disk, that's okay
            pass
        
        return None
        
    except (ValueError, RuntimeError):
        raise FileNotFoundException(filename)

"""
from fastapi import APIRouter
from fastapi.responses import FileResponse
import backend.path_fetch as path_fetch

router=APIRouter(prefix="/material", tags=["material"])

@router.get("/{day_id}/{filename}")
def get_file(day_id: int, filename: str):
    path = path_fetch.get_safe_path("material", day_id, filename)
    return FileResponse(path=path, filename=filename)
    """