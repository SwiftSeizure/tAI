from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.exceptions import EntityNotFoundException
from backend.database.schema import DBAssignment,DBMaterial,DBDay, DBClass, DBModule
from pathlib import Path
import shutil, os

# Cavnas Stuff
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv
import httpx
from fastapi import File, UploadFile
from backend.routers.material import upload_single_file
from backend.routers.material import delete_file as delete_material_file
from backend.routers.assignment import upload_assignment
from backend.routers.assignment import delete_file as delete_assignment_file
import tempfile
from datetime import datetime

# User/Security Stuff
from backend.exceptions import UnauthorizedException
from fastapi import Depends
from backend.auth import get_firebase_user_from_token
from typing import Any, Annotated

# Also Canvas
#basedir = __import__("pathlib").Path(__file__).parent
#load_dotenv(basedir / ".env")   # loads .env in repo root
fernet_key = os.getenv("FERNET_KEY")
if not fernet_key:
    raise EntityNotFoundException("FERNET_KEY", "environment variable")
fernet = Fernet(fernet_key)


def get_day(dayId:int, session:Session) -> DBDay:
    """ Get a day by its ID.

    Args:
        dayId (int): The ID of the day to retrieve.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        DBDay: The DBDay object.
    """
    stmnt = select(DBDay).filter(DBDay.id == dayId)
    day = session.execute(stmnt).scalar_one_or_none()

    if not day:
        raise EntityNotFoundException("day",dayId) # type: ignore
    
    return day

def get_day_assignment(dayId:int, session:Session) -> list[DBAssignment]:
    """ Get all assignments for a specific day.
    
    Args:
        dayId (int): The ID of the day to retrieve assignments from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        list[DBAssignment]: A list of DBAssignment objects representing the assignments for the day.
    """
    day = get_day(dayId,session)

    if not day:
        raise EntityNotFoundException("day",day)

    return day.assignments

def get_day_material(dayId:int, session:Session) -> list[DBMaterial]:
    """ Get all materials for a specific day.
    
    Args:
        dayId (int): The ID of the day to retrieve materials from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        list[DBMaterial]: A list of DBMaterial objects representing the materials for the day.
    """
    day = get_day(dayId,session)

    if not day:
        raise EntityNotFoundException("day", day)
    
    return day.materials

def delete_directory_contents(directory: Path) -> None:
    """Helper function to recursively delete a directory and its contents.
    
    Args:
        directory (Path): The directory to delete
    """
    if not directory.exists():
        return
        
    # First delete all files and subdirectories
    for item in directory.iterdir():
        if item.is_file():
            # Delete file
            os.remove(item)
        elif item.is_dir():
            # Recursively delete subdirectory
            delete_directory_contents(item)
            # Remove empty directory
            os.rmdir(item)
            
    # Finally remove the empty directory itself
    os.rmdir(directory)

def is_safe_path(base_dir: Path, directory: Path) -> bool:
    """Check if a directory is safe to delete.
    
    Args:
        base_dir (Path): The base directory of the application
        directory (Path): The directory to check
        
    Returns:
        bool: True if the path is safe to delete, False otherwise
    """
    try:
        # Check if path exists
        if not directory.exists():
            return True
            
        # Make sure the path is absolute and resolved (no symlinks)
        base_abs = base_dir.resolve()
        dir_abs = directory.resolve()
        
        # Check if directory is under uploads folder
        uploads_dir = base_abs / "uploads"
        if not str(dir_abs).startswith(str(uploads_dir)):
            print(f"Security warning: Attempted to access directory outside uploads: {directory}")
            return False
            
        # Make sure we're only in assignment or material directories
        parent_dir = dir_abs.parent.name
        if parent_dir not in ["assignment", "material"]:
            print(f"Security warning: Attempted to access invalid directory type: {parent_dir}")
            return False
            
        return True
        
    except Exception as e:
        print(f"Security check failed: {e}")
        return False

def delete_day_files(dayId: int) -> None:
    """Delete all physical files and folders associated with a day.
    
    Args:
        base_dir (Path): Base directory of the application
        dayId (int): The ID of the day being deleted
    """
    base_dir = Path(__file__).parent.parent.parent
    
    # Define paths to day folders
    assignment_dir = base_dir / "uploads" / "assignment" / str(dayId)
    material_dir = base_dir / "uploads" / "material" / str(dayId)
    
    # Check and delete assignment directory
    if is_safe_path(base_dir, assignment_dir):
        try:
            delete_directory_contents(assignment_dir)
        except Exception as e:
            print(f"Error deleting assignment directory: {e}")
    else:
        print(f"Skipping unsafe assignment path: {assignment_dir}")
    
    # Check and delete material directory
    if is_safe_path(base_dir, material_dir):
        try:
            delete_directory_contents(material_dir)
        except Exception as e:
            print(f"Error deleting material directory: {e}")
    else:
        print(f"Skipping unsafe material path: {material_dir}")


def delete_day(dayId: int, session: Session) -> None:
    """Delete a day and all its associated files.
    
    Args:
        dayId (int): The ID of the day to delete
        base_dir (Path): Base directory of the application
        session (Session): Database session
    """
    
    # Delete the day's folders and files
    delete_day_files(dayId)
    
    # Delete database entry (will cascade to assignments and materials)
    day = session.get(DBDay, dayId)
    if day:
        session.delete(day)
        session.commit()

    
def get_teacher_by_day_id(dayID: int, session: Session) -> str:
    """Get the teacher ID associated with a day by its ID.

    Args:
        dayID (int): The ID of the day.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.

    Returns:
        str: The teacher ID associated with the day.
    """
    day = get_day(dayID, session)
    if not day:
        raise EntityNotFoundException("day", dayID) # type: ignore
    return day.module.unit.class_.ownerID

# Canvas Things --------------------------------------------------------------------
async def get_canvas_materials(classroom: DBClass, db_day: DBDay, db_module: DBModule, user: Annotated[dict, Depends(get_firebase_user_from_token)], session: Session):
    
    # Data needed for API call
    api_key = fernet.decrypt(classroom.canvas_api_key.encode()).decode().strip() # type: ignore
    class_id = classroom.canvas_class_id # type: ignore
    module_id = db_module.canvas_id # type: ignore
    domain_name = classroom.canvas_domain_name # type: ignore
    
    # Create the get request and call it
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    url = f"https://{domain_name}/api/v1/courses/{class_id}/modules/{module_id}/items"
    r = httpx.get(url, headers=headers)
    items = r.json()
    
    for item in items:
        if item['type'] == 'File':
            url = f"https://{domain_name}/api/v1/courses/{class_id}/files/{item['content_id']}"
            r = httpx.get(url, headers=headers)
            file_info = r.json()
            
            download_url = file_info['url']
            filename = file_info['filename']
            if len(filename) > 255:
                filename = filename[:255]
            
            with httpx.Client(follow_redirects=True) as client:
                resp = client.get(download_url)
                resp.raise_for_status()
                with tempfile.NamedTemporaryFile(delete=False) as tmp:
                    tmp.write(resp.content)
                    temp_path = tmp.name
                    tmp_file = UploadFile(filename=filename, file=open(temp_path, "rb"))
                    
                    material = await upload_single_file(db_day.id, user, session, tmp_file, item['title']) #type: ignore
                    
                    iso = file_info['updated_at']
                    dt = datetime.fromisoformat(iso.replace("Z", ""))
                    material.updated_at = dt  # type: ignore
                    session.commit()
                    
                    
async def get_canvas_assignments(classroom: DBClass, db_day: DBDay, db_module: DBModule, user: Annotated[dict, Depends(get_firebase_user_from_token)], session: Session):
    # Data needed for API call
    api_key = fernet.decrypt(classroom.canvas_api_key.encode()).decode().strip() # type: ignore
    class_id = classroom.canvas_class_id # type: ignore
    module_id = db_module.canvas_id # type: ignore
    domain_name = classroom.canvas_domain_name # type: ignore
    
    # Create the get request and call it
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    url = f"https://{domain_name}/api/v1/courses/{class_id}/modules/{module_id}/items"
    r = httpx.get(url, headers=headers)
    items = r.json()
    
    for item in items:
        
        if item['type'] == 'Assignment':
            url = f"https://{domain_name}/api/v1/courses/{class_id}/assignments/{item['content_id']}"
            r = httpx.get(url, headers=headers)
            assignment_info = r.json()
            description = assignment_info["description"].split("=")
            for i in range(len(description)):
                
                # Look for data-api-endpoint in description (these are links to files in the assingment description)
                if "data-api-endpoint" in description[i]:
                    url = description[i+1].split('"')[1]
                    if "files" in url:
                        
                        r = httpx.get(url, headers=headers)
                        file_info = r.json()
                    
                        download_url = file_info['url']
                        filename = file_info['filename']
                        if len(filename) > 255:
                            filename = filename[:255]
                        
                        with httpx.Client(follow_redirects=True) as client:
                            resp = client.get(download_url)
                            resp.raise_for_status()
                            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                                tmp.write(resp.content)
                                temp_path = tmp.name
                                tmp_file = UploadFile(filename=filename, file=open(temp_path, "rb"))

                                assignment = await upload_assignment(db_day.id, item['title'], user, session, tmp_file) #type: ignore
                                iso = assignment_info['updated_at']
                                dt = datetime.fromisoformat(iso.replace("Z", ""))
                                assignment.updated_at = dt  # type: ignore
                                session.commit()

async def update_canvas_assignments(classroom: DBClass, db_day: DBDay, db_module: DBModule, user: Annotated[dict, Depends(get_firebase_user_from_token)], session: Session):
    """ Update a canvas modules assignments relative to our database.

    Args:
        classroom (DBClass):
        db_day (DBDay): 
        db_module (DBModule): 
        user (Annotated[dict, Depends): 
        session (Session): 
    """
    # Data needed for API call
    api_key = fernet.decrypt(classroom.canvas_api_key.encode()).decode().strip() # type: ignore
    class_id = classroom.canvas_class_id # type: ignore
    module_id = db_module.canvas_id # type: ignore
    domain_name = classroom.canvas_domain_name # type: ignore
    
    # Create the get request and call it
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    url = f"https://{domain_name}/api/v1/courses/{class_id}/modules/{module_id}/items"
    r = httpx.get(url, headers=headers)
    items = r.json()
    
    
    for item in items:
        if item['type'] == 'Assignment':
            url = f"https://{domain_name}/api/v1/courses/{class_id}/assignments/{item['content_id']}"
            r = httpx.get(url, headers=headers)
            assignment_info = r.json()
            
            # See if the assignment is already in the database
            stmt = select(DBAssignment).filter(DBAssignment.name == item['title'], DBAssignment.dayId == db_day.id)
            existing_assignment = session.execute(stmt).scalar_one_or_none()
            if existing_assignment:
                iso = assignment_info['updated_at']
                dt = datetime.fromisoformat(iso.replace("Z", ""))
                if existing_assignment.updated_at == dt: # type: ignore
                    continue  # No update needed
                else:
                    delete_assignment_file(db_day.id, existing_assignment.filename, user, session) #type:ignore
                    
            description = assignment_info["description"].split("=")
            for i in range(len(description)):
                
                # Look for data-api-endpoint in description (these are links to files in the assingment description)
                if "data-api-endpoint" in description[i]:
                    url = description[i+1].split('"')[1]
                    if "files" in url:
                        
                        r = httpx.get(url, headers=headers)
                        file_info = r.json()
                    
                        download_url = file_info['url']
                        filename = file_info['filename']
                        if len(filename) > 255:
                            filename = filename[:255]
                        
                        with httpx.Client(follow_redirects=True) as client:
                            resp = client.get(download_url)
                            resp.raise_for_status()
                            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                                tmp.write(resp.content)
                                temp_path = tmp.name
                                tmp_file = UploadFile(filename=filename, file=open(temp_path, "rb"))

                                assignment = await upload_assignment(db_day.id, item['title'], user, session, tmp_file) #type: ignore
                                
                                iso = file_info['updated_at']
                                dt = datetime.fromisoformat(iso.replace("Z", ""))
                                assignment.updated_at = dt  # type: ignore
                                session.commit()
        

async def update_canvas_materials(classroom: DBClass, db_day: DBDay, db_module: DBModule, user: Annotated[dict, Depends(get_firebase_user_from_token)], session: Session):
    # Data needed for API call
    api_key = fernet.decrypt(classroom.canvas_api_key.encode()).decode().strip() # type: ignore
    class_id = classroom.canvas_class_id # type: ignore
    module_id = db_module.canvas_id # type: ignore
    domain_name = classroom.canvas_domain_name # type: ignore
    
    # Create the get request and call it
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    url = f"https://{domain_name}/api/v1/courses/{class_id}/modules/{module_id}/items"
    r = httpx.get(url, headers=headers)
    items = r.json()
    
    for item in items:
        if item['type'] == 'File':
            url = f"https://{domain_name}/api/v1/courses/{class_id}/files/{item['content_id']}"
            r = httpx.get(url, headers=headers)
            file_info = r.json()
            
            download_url = file_info['url']
            filename = file_info['filename']
            
            # See if the material is already in the database and up to date
            stmt = select(DBMaterial).filter(DBMaterial.name == item['title'], DBMaterial.dayId == db_day.id)
            existing_material = session.execute(stmt).scalar_one_or_none()
            if existing_material:
                iso = file_info['updated_at']
                dt = datetime.fromisoformat(iso.replace("Z", ""))
                if existing_material.updated_at == dt: # type: ignore
                    continue  # No update needed
                else:
                    delete_material_file(db_day.id, existing_material.filename, user, session) #type:ignore
                    
            with httpx.Client(follow_redirects=True) as client:
                resp = client.get(download_url)
                resp.raise_for_status()
                with tempfile.NamedTemporaryFile(delete=False) as tmp:
                    tmp.write(resp.content)
                    temp_path = tmp.name
                    tmp_file = UploadFile(filename=filename, file=open(temp_path, "rb"))
                    
                    name = item['title']
                    if len(name) > 255:
                        name = name[:255]
            
                    material = await upload_single_file(db_day.id, user, session, tmp_file, name) #type: ignore
                    
                    iso = file_info['updated_at']
                    dt = datetime.fromisoformat(iso.replace("Z", ""))
                    material.updated_at = dt  # type: ignore
                    session.commit()