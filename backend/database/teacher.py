import random
import string
from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBTeacher, DBClass, DBStudent
from backend.models import CreateClassroom, TeacherUpdate
from backend.exceptions import EntityNotFoundException, DuplicateNameException

def get_teacher(teacherID: str, session: Session) -> DBTeacher:
    """ Get a DBTeacher object by its ID.
    
    Args:
        teacherID (int): The ID of the teacher to retrieve.
        session (Session): The SQLAlchemy session to use for the query.
    
    Raises:
        EntityNotFoundException: If the teacher with the given ID does not exist.
        
    Returns:
        DBTeacher: The DBTeacher object if found, otherwise None.
    """ 
    stmt = select(DBTeacher).filter(DBTeacher.id == teacherID)
    teacher = session.execute(stmt).scalar_one_or_none()
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    
    return teacher

def get_teacher_classes(teacherID: str, session: Session) -> list[DBClass]:
    """ Get all classes a teacher is associated with.
    
    Args:
        teacherID (int): The ID of the teacher to retrieve classes for.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the teacher with the given ID does not exist.
    
    Returns:
        list[DBClass]: A list of DBClass objects representing the classes the teacher is associated with.
    """
    teacher = get_teacher(teacherID, session) # type: ignore
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID) # type: ignore
    
    stmt = (
        select(DBTeacher)
        .options(selectinload(DBTeacher.classes))
        .filter(DBTeacher.id == teacherID)
    )
    result = session.execute(stmt).scalar_one_or_none()
    return list(result.classes) if result else []

def create_new_classroom(teacherID: str, classroom: CreateClassroom, session: Session) -> DBClass:
    """ Create a new classroom associated with a teacher.
    
    Args:
        teacherID (int): The ID of the teacher creating the classroom.
        classroom (CreateClassroom): The classroom data to create.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the teacher with the given ID does not exist.
        
    Returns:
        DBClass: The newly created DBClass object.
    """
    teacher = get_teacher(teacherID, session) # type: ignore
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID) # type: ignore
    
    duplicate_stmt = select(DBClass)\
        .filter(
            DBClass.name == classroom.name,
            DBClass.ownerID == teacherID  # Add teacher check
        )
    existing_classroom = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_classroom:
        raise DuplicateNameException("classroom", classroom.name)
    
    while True:
        class_code = generate_class_code()
        # Check if code already exists
        existing = session.query(DBClass).filter(DBClass.classCode == class_code).first()
        if not existing:
            break
    
    new_class = DBClass(
        name=classroom.name,
        ownerID=teacherID,
        settings=classroom.settings,
        classCode=class_code,
        published=classroom.published,
    )
    
    session.add(new_class)
    session.commit()
    session.refresh(new_class)
    
    return new_class
    
def update_teacher(teacherID: str,  update: TeacherUpdate, session: Session) -> None:
    """ Update a teacher's username and or name."""

    stmnt = (
        select(DBTeacher)
        .filter(DBTeacher.id == teacherID)
    )
    teacher = session.execute(stmnt).scalar_one_or_none()
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID) # type: ignore
    if update.name is not None:
        teacher.name = update.name #type: ignore
    if update.username is not None:
        teacher.userName = update.username #type: ignore
    session.commit()

    return None

def create_teacher(teacherID: str, name: str, username: str, session: Session) -> DBTeacher:
    """ Create a new teacher.
    
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
    duplicate_stmt = select(DBTeacher).filter(DBTeacher.userName == username)
    existing_teacher = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_teacher:
        raise DuplicateNameException("user", username)
    
    duplicate_stmt = select(DBStudent).filter(DBStudent.userName == username)
    existing_student = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_student:
        raise DuplicateNameException("user", username)
    
    
    new_teacher = DBTeacher(
        id=teacherID,
        name=name,
        userName=username
    )
    
    session.add(new_teacher)
    session.commit()
    session.refresh(new_teacher)
    
    return new_teacher


def generate_class_code() -> str:
    """Generate a random 6-character alphanumeric code."""
    chars = string.ascii_uppercase + string.digits

    return ''.join(random.choices(chars, k=6))