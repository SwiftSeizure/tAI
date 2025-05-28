
from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBTeacher, DBClass
from backend.models import CreateClassroom, TeacherUpdate
from backend.exceptions import EntityNotFoundException, DuplicateNameException

def get_teacher(teacherID: int, session: Session) -> DBTeacher:
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

def get_teacher_classes(teacherID: int, session: Session) -> list[DBClass]:
    """ Get all classes a teacher is associated with.
    
    Args:
        teacherID (int): The ID of the teacher to retrieve classes for.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the teacher with the given ID does not exist.
    
    Returns:
        list[DBClass]: A list of DBClass objects representing the classes the teacher is associated with.
    """
    teacher = get_teacher(teacherID, session)
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    
    stmt = (
        select(DBTeacher)
        .options(selectinload(DBTeacher.classes))
        .filter(DBTeacher.id == teacherID)
    )
    result = session.execute(stmt).scalar_one_or_none()
    return list(result.classes) if result else []

def create_new_classroom(teacherID: int, classroom: CreateClassroom, session: Session) -> DBClass:
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
    teacher = get_teacher(teacherID, session)
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    
    duplicate_stmt = select(DBClass)\
        .filter(
            DBClass.name == classroom.name,
            DBClass.ownerID == teacherID  # Add teacher check
        )
    existing_classroom = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_classroom:
        raise DuplicateNameException("classroom", classroom.name)
    
    new_class = DBClass(
        name=classroom.name,
        ownerID=teacherID,
        settings=classroom.settings
    )
    
    session.add(new_class)
    session.commit()
    session.refresh(new_class)
    
    return new_class
    
def update_teacher(teacherID: int,  update: TeacherUpdate, session: Session) -> None:
    """ Update a teacher's username and or name."""

    stmnt = (
        select(DBTeacher)
        .filter(DBTeacher.id == teacherID)
    )
    teacher = session.execute(stmnt).scalar_one_or_none()
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    if update.name is not None:
        teacher.name = update.name
    if update.username is not None:
        teacher.userName = update.username
    session.commit()

    return None

