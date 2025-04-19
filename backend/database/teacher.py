from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBTeacher, DBClass
from backend.models import CreateClassroom
from backend.exceptions import EntityNotFoundException

def get_teacher(teacherID: int, session: Session) -> DBTeacher | None:
    stmt = select(DBTeacher).filter(DBTeacher.id == teacherID)
    return session.execute(stmt).scalar_one_or_none()

def get_teacher_classes(teacherID: int, session: Session) -> list[DBClass]:
    teacher = get_teacher(teacherID, session)
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    
    stmt = (
        select(DBTeacher)
        .options(selectinload(DBTeacher.classes))
        .filter(DBTeacher.id == teacherID)
    )
    result = session.execute(stmt).scalar_one_or_none()
    return list(result.classes) if result else []

def create_new_classroom(teacherID: int, classroom: CreateClassroom, session: Session) -> DBClass:
    teacher = get_teacher(teacherID, session)
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    
    new_class = DBClass(
        name=classroom.name,
        ownerID=teacherID,
        settings=classroom.settings
    )
    
    session.add(new_class)
    session.commit()
    session.refresh(new_class)
    
    return new_class
    