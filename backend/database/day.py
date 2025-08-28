from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.exceptions import EntityNotFoundException
from backend.database.schema import DBAssignment,DBMaterial,DBDay
from pathlib import Path
import shutil, os


def getDay(dayId:int, session:Session) -> DBDay:
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
        raise EntityNotFoundException("day",dayId)
    
    return day

def getDayAssignment(dayId:int, session:Session) -> list[DBAssignment]:
    """ Get all assignments for a specific day.
    
    Args:
        dayId (int): The ID of the day to retrieve assignments from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        list[DBAssignment]: A list of DBAssignment objects representing the assignments for the day.
    """
    day = getDay(dayId,session)

    if not day:
        raise EntityNotFoundException("day",day)

    return day.assignments

def getDayMaterial(dayId:int, session:Session) -> list[DBMaterial]:
    """ Get all materials for a specific day.
    
    Args:
        dayId (int): The ID of the day to retrieve materials from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        list[DBMaterial]: A list of DBMaterial objects representing the materials for the day.
    """
    day = getDay(dayId,session)

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

def delete_day_files(base_dir: Path, dayId: int) -> None:
    """Delete all physical files and folders associated with a day.
    
    Args:
        base_dir (Path): Base directory of the application
        dayId (int): The ID of the day being deleted
    """
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


def delete_day(dayId: int, base_dir: Path, session: Session) -> None:
    """Delete a day and all its associated files.
    
    Args:
        dayId (int): The ID of the day to delete
        base_dir (Path): Base directory of the application
        session (Session): Database session
    """
    # Delete the day's folders and files
    delete_day_files(base_dir, dayId)
    
    # Delete database entry (will cascade to assignments and materials)
    day = session.get(DBDay, dayId)
    if day:
        session.delete(day)
        session.commit()
        