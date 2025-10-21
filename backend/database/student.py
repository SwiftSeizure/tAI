from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBStudent, DBEnrolled, DBClass, DBTeacher
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException, DuplicateNameException
from backend.models import StudentUpdate

def get_student(studentID: str, session: Session) -> DBStudent:
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
        raise EntityNotFoundException("student",studentID)
    
    return student

def get_student_classes(studentID: str, session: Session) -> list[DBClass]:
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
    for c in classes:
        if c.published is False:
            classes.remove(c) 
    return classes


def enroll(studentID: str, classCode: str, session: Session) -> int:


    """Enroll a student in a class.
    
    Args:
        studentID (int): The ID of the student to enroll.
        classID (int): The ID of the class to enroll the student in.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the student or class with the given ID does not exist.
        
    Returns:    

    """

    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)

    
    stmt = select(DBClass).filter(DBClass.classCode == classCode)
    classroom = session.execute(stmt).scalar_one_or_none()
    if not classroom:
        raise EntityNotFoundException("class", classCode)
    
    if classCode != classroom.classCode:
        raise InvalidClassCodeException()
    


    stmt = select(DBClass).filter(DBClass.classCode == classCode)
    classroom = session.execute(stmt).scalar_one_or_none()

    if not classroom:
        raise EntityNotFoundException("class", classCode)

    # Check if already enrolled using relationship
    stmt = select(DBEnrolled).filter(
        DBEnrolled.studentID == studentID,
        DBEnrolled.classID == classroom.id
    )
    existing_enrollment = session.execute(stmt).scalar_one_or_none()

    if existing_enrollment:
        return classroom.id  # type: ignore


    enrollment = DBEnrolled(studentID=studentID, classID=classroom.id)
    session.add(enrollment)
    session.commit()
    session.refresh(enrollment)
    session.refresh(student)
    session.refresh(classroom)

    
    return classroom.id #type: ignore


    


def updateStudent(studentID: str, update: StudentUpdate, session: Session) -> None:
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
        raise EntityNotFoundException("student", studentID) # type: ignore
    
    if update.name is not None:
        student.name = update.name # type: ignore
    if update.username is not None:
        student.userName = update.username # type: ignore

    session.commit()
    session.refresh(student)
    
    return None


def create_student(teacherID: str, name: str, username: str, session: Session) -> DBTeacher:
    """ Create a new student.
    
    Args:
        teacherID (str): The ID of the teacher to create.
        name (str): The name of the teacher.
        username (str): The username of the teacher.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        DuplicateNameException: If a teacher with the given username already exists.
        
    Returns:
        DBTeacher: The newly created DBTeacher object.
    """
    # Ensure no student already has this username
    duplicate_stmt = select(DBStudent).filter(DBStudent.userName == username)
    existing_student = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_student:
        raise DuplicateNameException("user", username)
    
    # Ensure a teacher does not have the same username as new student
    duplicate_stmt = select(DBTeacher).filter(DBTeacher.userName == username)
    existing_teacher = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_teacher:
        raise DuplicateNameException("user", username)
    
    # Create the student DBObject
    new_student = DBStudent(
        id=teacherID,
        name=name,
        userName=username,
        password_hash="firebase_auth"  # Placeholder for Firebase-authenticated users
    )
    
    # Add student to database
    session.add(new_student)
    session.commit()
    session.refresh(new_student)
    
    return new_student