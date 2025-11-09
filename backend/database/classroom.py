from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBClass, DBEnrolled, DBUnit,DBStudent, DBModule
from backend.exceptions import EntityNotFoundException, DuplicateNameException
from backend.models import ClassroomStudent, CreateUnit, ClassroomNameUpdate, ClassroomSettingsUpdate, CanvasData
from backend.database.day import delete_day_files

# Cavnas Stuff
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv
import httpx


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
        published = unit.published
        
    )
    
    # Add the new unit to the database
    classroom.units.append(db_unit)
    session.add(classroom)
    session.commit()
    return db_unit

def update_classroom_name(classroomID: int, newName: ClassroomNameUpdate, session: Session) -> DBClass:
    """Update a classroom name.
    
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
    
    # Check for duplicate name if name is being updated
    duplicate_stmt = select(DBClass)\
        .filter(
            DBClass.id != classroomID,  # Exclude current classroom
            DBClass.name == newName.name,
            DBClass.ownerID == classroom.ownerID  # Add teacher check
        )
    existing_classroom = session.execute(duplicate_stmt).scalar_one_or_none()
    if existing_classroom:
        raise DuplicateNameException("classroom", newName.name)
    classroom.name = newName.name # type: ignore
    
    session.commit()
    return classroom



def update_classroom_settings(classroomID: int, settings: ClassroomSettingsUpdate, session: Session) -> DBClass:
    """Update a classroom settings.
    
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
    classroom.settings = settings.settings # type: ignore
        
    session.commit()
    return classroom



def add_canvas_api_key(classID: int, data: CanvasData, session: Session):
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

    classroom.canvas_api_key = fernet.encrypt(data.api_key.encode()) # type: ignore
    classroom.canvas_class_id = data.class_id # type: ignore
    classroom.canvas_domain_name = data.domain_name # type: ignore
    create_new_unit(classID, CreateUnit(name="Canvas Modules", settings={}, published=False), session)
    session.commit()
    get_canvas_modules(classID, session)
    
    
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
    
    
    
    
# ---------------------------------------------------------------------------------------------#
# Start of Canvas integration
def get_canvas_modules(classID: int, session: Session) -> None:
    """Return DBModule objects for the unit named "Canvas Modules" in a class.

    Returns None when Canvas connection info isn't configured on the classroom.
    Raises EntityNotFoundException if the classroom or the "Canvas Modules" unit can't be found.
    """
    classroom = get_classroom(classID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classID) # type: ignore
    
    # Data needed for API call
    api_key = fernet.decrypt(classroom.canvas_api_key.encode()).decode() # type: ignore
    class_id = classroom.canvas_class_id # type: ignore
    domain_name = classroom.canvas_domain_name # type: ignore
    
    # Get the unit the modules will go in
    stmt = select(DBUnit).filter(
        DBUnit.classID == classID,
        DBUnit.name == "Canvas Modules")
    canvas_unit = session.execute(stmt).scalar_one_or_none()
    if not canvas_unit:
        raise EntityNotFoundException("unit", "Canvas Modules") # type: ignore  
    
    # Create the get request and call it
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    url = f"https://{domain_name}/api/v1/courses/{class_id}/modules"
    r = httpx.get(url, headers=headers)
    modules = r.json()
    
    # Add modules to the database
    for module in modules:
        if len(module['name']) > 255:
            module['name'] = module['name'][:255]
        db_module = DBModule(
            name = module['name'],
            sequence = module['position'],
            unitID = canvas_unit.id,
            canvas_id = module['id']  # type: ignore
        )
        session.add(db_module)
    session.commit()

    
