from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBStudent, DBEnrolled, DBClass
from backend.exceptions import EntityNotFoundException

def get_student(studentID: int, session: Session) -> DBStudent:
    """Get a DBStudent object by its ID.
    
    Args:
        studentID (int): The ID of the student to retrieve.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the student with the given ID does not exist.
        
    Returns:    
        DBStudent: The DBStudent object if found, otherwise None.
    """
    stmt = select(DBStudent).filter(DBStudent.id == studentID)
    student = session.execute(stmt).scalar_one_or_none()
    if not student:
        raise EntityNotFoundException("module",studentID)
    
    return student

def get_student_classes(studentID: int, session: Session) -> list[DBClass]:
    """Get all classes a student is enrolled in.
    
    Args:
        studentID (int): The ID of the student to retrieve classes for.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the student with the given ID does not exist.
        
    Returns:    
        list[DBClass]: A list of DBClass objects representing the classes the student is enrolled in.
    """
    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)
    
    stmt = (
        select(DBClass)
        .join(DBEnrolled)
        .options(selectinload(DBClass.owner))  # Optional: eager load teacher info
        .filter(DBEnrolled.studentID == studentID)
    )
    
    result = session.execute(stmt)
    classes = list(result.scalars().all())
    return classes