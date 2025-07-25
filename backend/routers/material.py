from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from backend.exceptions import FileNotFoundException, ClientErrorResponse, DuplicateNameException
from backend.database import material as db_material
from backend.dependencies import DBSession
from pathlib import Path
import shutil
from datetime import datetime
from backend.validators import DocumentValidator
import mimetypes
import os
# import backend.path_fetch as path_fetch

router=APIRouter(prefix="/material", tags=["material"])

# Get the absolute path to one directory above the current file
BASE_DIR = Path(__file__).parent.parent.parent

#Create a validator instance
doc_validator = DocumentValidator(max_size= 25 * 1024 * 1024)

@router.get("/{dayID}/{filename}")
def get_file(dayID: int, filename: str):
    # Start from BASE_DIR and navigate to uploads
    file_path = BASE_DIR / "uploads" / "material" / str(dayID) / filename
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


@router.delete("/{dayID}/{filename}",
                status_code=204,
                responses={
                    404: {"model": ClientErrorResponse},
                    403: {"model": ClientErrorResponse}
                },
                summary="Delete a file for a specific day.")
def delete_file(dayID: int, filename: str, session: DBSession):
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
        raise FileNotFoundException(filename)


@router.post("{dayID}/{filename}",
                status_code=201,
                responses={
                    404: {"model": ClientErrorResponse},
                    })
async def upload_single_file(dayID: int, filename: str, file: UploadFile = File(...)):
    """Upload a single file with basic validation"""
    if file.filename == "":
        raise HTTPException(status_code=400, detail="No file selected")

    # Check if the folder exists, if not create it
    UPLOAD_DIR = BASE_DIR / "uploads" / "material" / str(dayID)
    UPLOAD_DIR.mkdir(exist_ok=True)
    
    file_path = BASE_DIR / "uploads" / "material" / str(dayID) / filename

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
        raise DuplicateNameException("file" , filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )

    # TODO add the new material to the database.
    #db_material.create_material(dayID, filename, file.content_type)

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": file.size,
        "upload_time": datetime.now().isoformat(),
        "location": str(file_path)
    }