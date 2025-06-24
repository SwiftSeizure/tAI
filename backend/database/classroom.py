from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBClass, DBUnit
from backend.exceptions import EntityNotFoundException

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