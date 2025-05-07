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