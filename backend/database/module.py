from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.exceptions import EntityNotFoundException
from backend.database.schema import DBModule,DBDay

def get_module(moduleID: int, session:Session) -> DBModule | None:
    stmnt = select(DBModule).filter(DBModule.id == moduleID)
    module = session.execute(stmnt).scalar_one_or_none()

    if not module:
        raise EntityNotFoundException("module",moduleID)
    
    return module

def get_module_days(moduleID:int,session:Session) -> list[DBDay]:
    module = get_module(moduleID,session)

    if not module:
        raise EntityNotFoundException("module",moduleID)
    
    return module.days