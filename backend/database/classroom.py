from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBClass, DBEnrolled, DBUnit,DBStudent
from backend.exceptions import EntityNotFoundException, DuplicateNameException
from backend.models import ClassroomStudent, CreateUnit, ClassroomUpdate
from backend.database.day import delete_day_files

from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

basedir = __import__("pathlib").Path(__file__).parent
load_dotenv(basedir / ".env")   # loads .env in repo root

fernet_key = os.getenv("FERNET_KEY")
if not fernet_key:
    raise EntityNotFoundException("FERNET_KEY", "environment variable")
fernet = Fernet(fernet_key)

def get_classroom(classroomID: int, session: Session) -> DBClass | None:
    """Get a DBClass object by its ID.

    Args:
        classroomID (int): The ID of the classroom to retrieve.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the classroom with the given ID does not exist.

    Returns:
        DBClass: The DBClass object if found, otherwise None.
    """
    stmt = select(DBClass).filter(DBClass.id == classroomID)
    classroom = session.execute(stmt).scalar_one_or_none()
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore
    return classroom

def get_class_units(classroomID: int, session: Session) -> list[DBClass]:
    """Get all units in a classroom.

    Args:
        classroomID (int): The ID of the classroom to retrieve units from.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the classroom with the given ID does not exist.

    Returns:
        list[DBClass]: A list of DBClass objects representing the units in the classroom.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore
    return classroom.units

def create_new_unit(classroomID: int, unit: CreateUnit, session: Session) -> DBUnit:
    """Create a new unit in a classroom.

    Args:
        classroomID (int): The ID of the classroom to create the unit in.
        unit (CreateUnit): The data for the new unit.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the classroom with the given ID does not exist.

    Returns:
        DBUnit: The newly created DBUnit object.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore
    
    # Get the highest sequence number and add 10
    stmt = select(DBUnit.sequence)\
        .filter(DBUnit.classID == classroomID)\
        .order_by(DBUnit.sequence.desc())\
        .limit(1)
    result = session.execute(stmt).scalar()
    sequence_number = (result or 0) + 10
    
    # Check for duplicate unit name
    duplicate_stmt = select(DBUnit)\
        .filter(DBUnit.classID == classroomID, 
                DBUnit.name == unit.name)
    existing_unit = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_unit:
        raise DuplicateNameException("unit", unit.name)
    
    # Create the new unit
    db_unit = DBUnit(
        name = unit.name,
        sequence = sequence_number,
        classID = classroomID,
        settings = unit.settings,
        
    )
    
    # Add the new unit to the database
    classroom.units.append(db_unit)
    session.add(classroom)
    session.commit()
    return db_unit

def update_classroom(classroomID: int, classroomUpdates: ClassroomUpdate, session: Session) -> DBClass:
    """Update a classroom name and/or settings.
    
    Args:
        ClassID (int) : The id of the classroom being updated
        classroomUpdates (ClassroomUpdate): The updates to apply to a classroom.
        session (Session): The database session
        
    Returns:
        DBClassroom: The updated classroom.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore
    
    # Update the classroom name
    if classroomUpdates.name:
        # Check for duplicate name if name is being updated
        duplicate_stmt = select(DBClass)\
            .filter(
                DBClass.id != classroomID,  # Exclude current classroom
                DBClass.name == classroomUpdates.name,
                DBClass.ownerID == classroom.ownerID  # Add teacher check
            )
        existing_classroom = session.execute(duplicate_stmt).scalar_one_or_none()
        if existing_classroom:
            raise DuplicateNameException("classroom", classroomUpdates.name)
        classroom.name = classroomUpdates.name # type: ignore
    
    # Update the classroom settings
    if classroomUpdates.settings:
        classroom.settings = classroomUpdates.settings # type: ignore
    
    session.commit()
    return classroom


def add_canvas_api_key(classID: int, api_key: str, session: Session):
    """Add a new Canvas API key for a classroom.
        The API key is encrypted before being stored in the database.
    
    Args:
        classID (int): The ID of the classroom to add the API key to.
        api_key (str): The API key to add.
        session (Session): The database session.
        
    Raises:
        EntityNotFoundException: If the classroom with the given ID does not exist.
    """
    classroom = get_classroom(classID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classID) # type: ignore

    classroom.canvas_api_key = fernet.encrypt(api_key.encode()) # type: ignore
    session.commit()
    
    
def delete_classroom(classroomID: int, session: Session) -> None:
    """Delete a classroom by its ID.

    Args:
        classroomID (int): The ID of the classroom to delete.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the classroom with the given ID does not exist.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        return
    
    for unit in classroom.units:
        for module in unit.modules:
            for day in module.days:
                delete_day_files(day.id)

    session.delete(classroom)
    session.commit()

    
def get_teacher_id_by_class_id(classID : int, session: Session) -> str:
    """Get a teacher's user ID by a class ID.
    Args: 
        classID (int): The ID of the class.
        session (Session): The SQLAlchemy session to use for the query.
    Raises:
        EntityNotFoundException: If the class with the given ID does not exist."""
    classroom = get_classroom(classID, session)
    return classroom.ownerID # type: ignore


def delete_student_from_classroom(classroomID: int, studentID: int, session: Session) -> None:
    """Delete a student from a classroom by its ID.
    Args:
        classroomID (int): The ID of the classroom to delete the student from.
        studentID (int): The ID of the student to delete.
        session (Session): The database session.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore

    stmt = select(DBEnrolled).filter(DBEnrolled.classID == classroomID, DBEnrolled.studentID == studentID)
    enrolled = session.execute(stmt).scalar_one_or_none()
    if not enrolled:
        raise EntityNotFoundException("enrolled", studentID) #type: ignore

    session.delete(enrolled)
    session.commit()

def get_students_in_classroom(classroomID: int, session: Session) -> list[ClassroomStudent]:
    """Get all students in a classroom by its ID.
    Args:
        classroomID (int): The ID of the classroom to get the students from.
        session (Session): The database session.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore

    stmt = select(DBStudent).join(DBEnrolled).filter(DBEnrolled.classID == classroomID)
    students = session.execute(stmt).scalars().all()
    classroom_students = [ClassroomStudent(id=student.id, name=student.name, username=student.userName) for student in students] # type: ignore
    return sorted(classroom_students, key=lambda x: x.name.lower())

def update_classroom_published_status(classroomID: int, session: Session) -> None:
    """Update a classrooms's published status.
    Args:
        classroomID (int): The ID of the classroom to update the published status of.
        published (bool): The new published status.
        session (Session): The database session.
    """
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID) # type: ignore
    classroom.published = not classroom.published # type: ignore
    session.commit()