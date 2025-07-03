from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.exceptions import EntityNotFoundException
from backend.database.schema import DBModule,DBDay

def get_module(moduleID: int, session:Session) -> DBModule:
    """Get a DBModule object by its ID.
    
    Args:
        moduleID (int): The ID of the module to retrieve.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the module with the given ID does not exist.
        
    Returns:
        DBModule: The DBModule object if found, otherwise None.
    """
    stmnt = select(DBModule).filter(DBModule.id == moduleID)
    module = session.execute(stmnt).scalar_one_or_none()
    if not module:
        raise EntityNotFoundException("module",moduleID)
    return module

def get_module_days(moduleID:int,session:Session) -> list[DBDay]:
    """ Get all days for a specific module.
    
    Args:
        moduleID (int): The ID of the module to retrieve days from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the module with the given ID does not exist.
        
    Returns:
        list[DBDay]: A list of DBDay objects representing the days for the module.
    """
    module = get_module(moduleID,session)

    if not module:
        raise EntityNotFoundException("module",moduleID)
    
    return module.days


def create_new_day(moduleID: int, session: Session) -> DBModule:
    """Create a new day in a module.

    Args:
        moduleID (int): The ID of the module to create the day in.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the module with the given ID does not exist.

    Returns:
        DBModule: The newly created DBUnit object.
    """
    module = get_module(moduleID, session)
    
    # Get the highest sequence number and add 10
    stmt = select(DBDay.sequence)\
        .filter(DBDay.moduleID == moduleID)\
        .order_by(DBDay.sequence.desc())\
        .limit(1)
    result = session.execute(stmt).scalar()
    sequenceNumber = (result or 0) + 10
    
    stmt = select(DBDay)\
        .filter(DBDay.moduleID == moduleID)
    existingDays = session.execute(stmt).scalars().all()
    
    # Name will just be the number of the day
    dayName = f"Day {len(existingDays) + 1}"
    
    # Create the new module
    db_day = DBDay(
        name = dayName,
        sequence = sequenceNumber,
        moduleID = moduleID,
    )
    
    # Add the new unit to the database
    module.days.append(db_day)
    session.add(module)
    session.commit()
    return db_day


def delete_module(moduleID: int, session: Session) -> None:
    """Delete a module by its ID.
    Args:
        moduleID (int): The ID of the module to delete.
        session (Session): The SQLAlchemy session to use for the query.
    Raises:
        EntityNotFoundException: If the module with the given ID does not exist.
    """
    module = get_module(moduleID, session)
    session.delete(module)
    session.commit()