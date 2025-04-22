from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBUnit, DBModule, DBDay
from backend.exceptions import EntityNotFoundException

def get_unit(unitID: int, session: Session) -> DBUnit:
    """ Get a DBUnit object by its ID.
    
    Args:
        unitID (int): The ID of the unit to retrieve.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the unit with the given ID does not exist.
        
    Returns:
        DBUnit: The DBUnit object if found.
    """
    stmt = select(DBUnit).filter(DBUnit.id == unitID)
    unit = session.execute(stmt).scalar_one_or_none()
    if not unit:
        raise EntityNotFoundException("unit", unitID)
    
    return unit

def get_unit_modules(unitID: int, session: Session) -> list[DBModule]:
    """ Get all modules in a unit.
    
    Args:
        unitID (int): The ID of the unit to retrieve modules from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the unit with the given ID does not exist.
        
    Returns:
        list[DBModule]: A list of DBModule objects representing the modules in the unit.
    """
    stmt = (
        select(DBUnit)
        .options(selectinload(DBUnit.modules).selectinload(DBModule.days))
        .filter(DBUnit.id == unitID)
    )
    unit = session.execute(stmt).scalar_one_or_none()
    if not unit:
        raise EntityNotFoundException("unit", unitID)
    
    return list(unit.modules)