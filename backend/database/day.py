from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.exceptions import EntityNotFoundException
from backend.database.schema import DBAssignment,DBMaterial,DBDay


def getDay(dayId:int, session:Session) -> DBDay:
    """ Get a day by its ID.

    Args:
        dayId (int): The ID of the day to retrieve.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        DBDay: The DBDay object.
    """
    stmnt = select(DBDay).filter(DBDay.id == dayId)
    day = session.execute(stmnt).scalar_one_or_none()

    if not day:
        raise EntityNotFoundException("day",dayId)
    
    return day

def getDayAssignment(dayId:int, session:Session) -> list[DBAssignment]:
    """ Get all assignments for a specific day.
    
    Args:
        dayId (int): The ID of the day to retrieve assignments from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        list[DBAssignment]: A list of DBAssignment objects representing the assignments for the day.
    """
    day = getDay(dayId,session)

    if not day:
        raise EntityNotFoundException("day",day)

    return day.assignments

def getDayMaterial(dayId:int, session:Session) -> list[DBMaterial]:
    """ Get all materials for a specific day.
    
    Args:
        dayId (int): The ID of the day to retrieve materials from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the day with the given ID does not exist.
        
    Returns:
        list[DBMaterial]: A list of DBMaterial objects representing the materials for the day.
    """
    day = getDay(dayId,session)

    if not day:
        raise EntityNotFoundException("day", day)
    
    return day.materials


