from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBClass, DBUnit
from backend.models import CreateUnit
from backend.exceptions import EntityNotFoundException, DuplicateNameException

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
    return session.execute(stmt).scalar_one_or_none()

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
        raise EntityNotFoundException("classroom", classroomID)
    
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
        raise EntityNotFoundException("classroom", classroomID)
    
    # Get the highest sequence number and add 1
    stmt = select(DBUnit.sequence)\
        .filter(DBUnit.classID == classroomID)\
        .order_by(DBUnit.sequence.desc())\
        .limit(1)
    result = session.execute(stmt).scalar()
    sequence_number = (result or 0) + 1
    
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