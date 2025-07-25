from sqlalchemy import select
from sqlalchemy.orm import Session
from .schema import DBMaterial, DBDay
from backend.exceptions import EntityNotFoundException, UploadNotFoundException
from pathlib import Path

def delete_material(dayId: int, filename: str, session: Session):
    """Delete a material from the database and return its path.
    
    Args:
        dayId (int): The ID of the day the material belongs to
        filename (str): The name of the file to delete
        session (Session): Database session
        
    Returns:
        str: The file path that needs to be deleted
        
    Raises:
        EntityNotFoundException: If the material is not found
    """
    # Find the material entry
    stmt = select(DBMaterial).filter(
        DBMaterial.dayId == dayId,
        DBMaterial.filename == filename
    )
    material = session.execute(stmt).scalar_one_or_none()
    
    if not material:
        raise UploadNotFoundException(dayId, filename)
    
    # Delete from database
    session.delete(material)
    session.commit()

# TODO
#def create_material