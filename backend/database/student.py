from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBStudent, DBEnrolled, DBClass
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException, AlreadyEnrolledException
from backend.models import StudentUpdate

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

def enroll(studentID: int, classCode: int, session: Session) -> None:
    """Enroll a student in a class.
    
    Args:
        studentID (int): The ID of the student to enroll.
        classID (int): The ID of the class to enroll the student in.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the student or class with the given ID does not exist.
        
    Returns:    
        None
    """

    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)
    
    stmt = select(DBClass).filter(DBClass.classCode == classCode)

    classroom = session.execute(stmt).scalar_one_or_none()

    if not classroom:
        raise EntityNotFoundException("class", classCode)
    
    classID = classroom.id
    
    if classCode != classroom.classCode:
        raise InvalidClassCodeException()
    
    
    enrolled_stmt = (
        select(DBEnrolled)
        .filter(DBEnrolled.studentID == studentID, DBEnrolled.classID == classID)
    )
    already_enrolled = session.execute(enrolled_stmt).scalar_one_or_none()
    
    if already_enrolled:
        raise AlreadyEnrolledException(studentID, classCode)
    
    enrollment = DBEnrolled(studentID=studentID, classID=classID)
    session.add(enrollment)
    session.commit()
    session.refresh(enrollment)
    session.refresh(student)
    session.refresh(classroom)
    
    return None

def updateStudent(studentID: int, update: StudentUpdate, session: Session) -> None:
    """Update a student's information.
    
    Args:
        studentID (int): The ID of the student to update.
        update (StudentUpdate): The new information for the student.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the student with the given ID does not exist.
        
    Returns:    
        None
    """
    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)
    
    if update.name is not None:
        student.name = update.name
    if update.username is not None:
        student.userName = update.username
    
    session.commit()
    session.refresh(student)
    
    return None

