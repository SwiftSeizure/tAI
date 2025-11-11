from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.database.schema import DBAssignment, DBPrompt_Count_Assignment
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
    
    
def create_assignment(dayID: int, name: str, filename: str, fileType: str | None, session: Session, remoteID: str | None) -> DBAssignment:
    """Create a new assignment entry in the database.
    
    Args:
        dayID (int): The ID of the day the material belongs to
        filename (str): The name of the file
        fileType (str): The type of the file
        session (Session): Database session
        
    Returns:
        DBAssignment: The created material entry
    """
    
    new_assignment = DBAssignment(
        name=name,
        filename=filename,
        sequence=0,  # Default sequence, can be updated later
        path=f"uploads/assignment/{dayID}/{filename}",
        dayId=dayID,
        remoteID=remoteID
    )
    
    session.add(new_assignment)
    session.commit()
    session.refresh(new_assignment)
    
    return new_assignment

def get_RemoteID(path: str, session: Session):
    stmt = select(DBAssignment).filter(
        DBAssignment.path == path
    )
    assignment = session.execute(stmt).scalar_one_or_none()
    ret = assignment.remoteID if assignment else None
    return ret 

def increment_prompt_count_assignment(assignmentID: int, studentID: str, session: Session):
    stmt = select(DBPrompt_Count_Assignment).filter(
        DBPrompt_Count_Assignment.assignmentID == assignmentID,
        DBPrompt_Count_Assignment.studentID == studentID
    )
    prompt_count = session.execute(stmt).scalar_one_or_none()
    if not prompt_count:
        prompt_count = DBPrompt_Count_Assignment(assignmentID=assignmentID,studentID=studentID, count=1)
        session.add(prompt_count)
    else:
        prompt_count.count += 1
    session.commit()
    return prompt_count

def get_prompt_count_assignment(assignmentID: int, studentID: str, session: Session):
    stmt = select(DBPrompt_Count_Assignment).filter(
        DBPrompt_Count_Assignment.assignmentID == assignmentID,
        DBPrompt_Count_Assignment.studentID == studentID
    )
    prompt_count = session.execute(stmt).scalar_one_or_none()
    return prompt_count.count if prompt_count else 0

def get_prompt_count_all_assignment(assignmentID: int, session: Session):
    stmt = select(DBPrompt_Count_Assignment).filter(
        DBPrompt_Count_Assignment.assignmentID == assignmentID
    )
    prompt_counts = session.execute(stmt).scalars().all()
    return {prompt_count.studentID: prompt_count.count for prompt_count in prompt_counts}  

def get_assignment_id_by_path(path: str, session: Session):
    stmt = select(DBAssignment).filter(
        DBAssignment.path == path
    )
    assignment = session.execute(stmt).scalar_one_or_none()
    return assignment.id if assignment else None