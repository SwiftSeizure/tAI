from sqlalchemy import select
from sqlalchemy.orm import Session
from .schema import DBMaterial, DBDay
from backend.exceptions import EntityNotFoundException, DuplicateNameException
from pathlib import Path
from typing import BinaryIO

def get_material(materialID: int, session: Session) -> DBMaterial:
    """Get a material by ID.
    
    Args:
        materialID (int): The ID of the material to retrieve.
        session (Session): The database session.
        
    Raises:
        EntityNotFoundException: If the material is not found.
        
    Returns:
        DBMaterial: The material object.
    """
    material = session.get(DBMaterial, materialID)
    if not material:
        raise EntityNotFoundException("material", materialID)
    return material

def get_day_materials(dayID: int, session: Session) -> list[DBMaterial]:
    """Get all materials for a day.
    
    Args:
        dayID (int): The ID of the day to get materials for.
        session (Session): The database session.
        
    Returns:
        list[DBMaterial]: List of materials for the day.
    """
    stmt = select(DBMaterial).filter(DBMaterial.dayID == dayID)
    return list(session.execute(stmt).scalars().all())

def create_material(dayID: int, filename: str, file_path: str, session: Session) -> DBMaterial:
    """Create a new material entry in the database.
    
    Args:
        dayID (int): The ID of the day this material belongs to.
        filename (str): The name of the uploaded file.
        file_path (str): The relative path where the file is stored.
        session (Session): The database session.
        
    Raises:
        EntityNotFoundException: If the day does not exist.
        DuplicateNameException: If a material with this name already exists for this day.
        
    Returns:
        DBMaterial: The newly created material object.
    """
    # Check if day exists
    day = session.get(DBDay, dayID)
    if not day:
        raise EntityNotFoundException("day", dayID)
    
    # Check for duplicate filename in this day
    duplicate_stmt = select(DBMaterial)\
        .filter(DBMaterial.dayId == dayID,
                DBMaterial.name == filename)
    existing_material = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_material:
        raise DuplicateNameException("material", filename)
    
    # Get the highest sequence number and add 10
    stmt = select(DBMaterial.sequence)\
        .filter(DBDay.id == dayID)\
        .order_by(DBDay.sequence.desc())\
        .limit(1)
    result = session.execute(stmt).scalar()
    sequenceNumber = (result or 0) + 10
    
    # Create new material
    material = DBMaterial(
        name=filename,
        filename=filename,
        sequence=sequenceNumber,
        path=file_path,
        dayId=dayID
    )
    
    session.add(material)
    session.commit()
    session.refresh(material)
    
    return material
'''
def delete_material(materialID: int, session: Session) -> None:
    """Delete a material from the database.
    
    Args:
        materialID (int): The ID of the material to delete.
        session (Session): The database session.
        
    Raises:
        EntityNotFoundException: If the material is not found.
    """
    material = get_material(materialID, session)
    session.delete(material)
    session.commit()
'''