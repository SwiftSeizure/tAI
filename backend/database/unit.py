from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBUnit, DBModule, DBDay
from backend.exceptions import EntityNotFoundException

def get_unit(unitID: int, session: Session) -> DBUnit | None:
    stmt = select(DBUnit).filter(DBUnit.id == unitID)
    return session.execute(stmt).scalar_one_or_none()

def get_unit_modules(unitID: int, session: Session) -> list[DBModule]:
    stmt = (
        select(DBUnit)
        .options(selectinload(DBUnit.modules).selectinload(DBModule.days))
        .filter(DBUnit.id == unitID)
    )
    unit = session.execute(stmt).scalar_one_or_none()
    if not unit:
        raise EntityNotFoundException("unit", unitID)
    
    return list(unit.modules)