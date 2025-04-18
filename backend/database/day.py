from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.exceptions import EntityNotFoundException
from backend.database.schema import DBAssignment,DBMaterial,DBDay


def getDay(dayId:int, session:Session) -> DBDay |None:
    stmnt = select(DBDay).filter(DBDay.id == dayId)
    day = session.execute(stmnt).scalar_one_or_none()

    if not day:
        raise EntityNotFoundException("day",day)
    
    return day

def getDayAssignment(dayId:int, session:Session) -> list[DBAssignment] |None:
    day = getDay(dayId,session)

    if not day:
        raise EntityNotFoundException("day",day)

    return day.assignments

def getDayMaterial(dayId:int, session:Session) -> list[DBMaterial] |None:
    day = getDay(dayId,session)

    if not day:
        raise EntityNotFoundException("day", day)
    
    return day.materials