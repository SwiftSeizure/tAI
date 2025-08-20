from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.database.schema import DBAssignment
from backend.exceptions import UploadNotFoundException

def delete_assignment(dayID: int, filename: str, session: Session) -> None:
    """Delete an assignment from the database.
    
    Args:
        dayId (int): The day ID the assignment belongs to
        filename (str): The name of the file to delete
        session (Session): Database session
        
    Raises:
        EntityNotFoundException: If the assignment doesn't exist
    """
    print(f"=== Attempting database delete ===")  # Add this
    print(f"dayID: {dayID}, filename: {filename}")  # Add this
    
    stmt = select(DBAssignment).filter(
        DBAssignment.dayId == dayID,
        DBAssignment.filename == filename
    )
    assignment = session.execute(stmt).scalar_one_or_none()
    
    print(f"Assignment found: {assignment}")  # Add this
    
    if not assignment:
        raise UploadNotFoundException(dayID, filename)
    
    session.delete(assignment)
    session.commit()