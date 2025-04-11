from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBTeacher, DBClass

def get_teacher_classes(teacher_id: int, session: Session) -> list[DBClass]:
    # Using select statement
    stmt = (
        select(DBTeacher)
        .options(selectinload(DBTeacher.classes))
        .filter(DBTeacher.id == teacher_id)
    )
    teacher = session.execute(stmt).scalar_one_or_none()
    if teacher:
        print(teacher.classes)
        
    return list(teacher.classes) if teacher else []

    