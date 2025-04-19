from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBClass, DBUnit
from backend.exceptions import EntityNotFoundException

def get_classroom(classroomID: int, session: Session) -> DBClass | None:
    stmt = select(DBClass).filter(DBClass.id == classroomID)
    return session.execute(stmt).scalar_one_or_none()

def get_class_units(classroomID: int, session: Session) -> list[DBClass]:
    classroom = get_classroom(classroomID, session)
    if not classroom:
        raise EntityNotFoundException("classroom", classroomID)
    
    return classroom.units