from sqlalchemy import select
from sqlalchemy.orm import Session
from .schema import DBMaterial, DBDay, DBPrompt_Count_Material
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


def create_material(dayID: int, name: str, filename: str, fileType: str | None, session: Session, remoteID: str | None) -> DBMaterial:
    """Create a new material entry in the database.
    
    Args:
        dayID (int): The ID of the day the material belongs to
        filename (str): The name of the file
        fileType (str): The type of the file
        session (Session): Database session
        
    Returns:
        DBMaterial: The created material entry
    """
    
    new_material = DBMaterial(
        name=name,
        filename=filename,
        sequence=0,  # Default sequence, can be updated later
        path=f"uploads/material/{dayID}/{filename}",
        dayId=dayID,
        remoteID=remoteID  
    )
    
    session.add(new_material)
    session.commit()
    session.refresh(new_material)
    
    return new_material

def get_RemoteID(path: str, session: Session):
    stmt = select(DBMaterial).filter(
        DBMaterial.path == path
    )
    material = session.execute(stmt).scalar_one_or_none()
    ret = material.remoteID if material else None
    return ret 

def increment_prompt_count_material(materialID: int, studentID: str, session: Session):
    stmt = select(DBPrompt_Count_Material).filter(
        DBPrompt_Count_Material.materialID == materialID,
        DBPrompt_Count_Material.studentID == studentID
    )
    prompt_count = session.execute(stmt).scalar_one_or_none()
    if not prompt_count:
        prompt_count = DBPrompt_Count_Material(materialID=materialID, studentID=studentID, count=1)
        session.add(prompt_count)
    else:
        prompt_count.count += 1
    session.commit()
    return prompt_count


def get_prompt_count_material(materialID: int, studentID: str, session: Session):
    stmt = select(DBPrompt_Count_Material).filter(
        DBPrompt_Count_Material.materialID == materialID,
        DBPrompt_Count_Material.studentID == studentID
    )
    prompt_count = session.execute(stmt).scalar_one_or_none()
    return prompt_count.count if prompt_count else 0

def get_prompt_count_all_material(materialID: int, session: Session):
    stmt = select(DBPrompt_Count_Material).filter(
        DBPrompt_Count_Material.materialID == materialID
    )
    prompt_counts = session.execute(stmt).scalars().all()
    return {prompt_count.studentID: prompt_count.count for prompt_count in prompt_counts}

def get_material_id_by_path(path: str, session: Session):
    stmt = select(DBMaterial).filter(
        DBMaterial.path == path
    )
    material = session.execute(stmt).scalar_one_or_none()
    return material.id if material else None