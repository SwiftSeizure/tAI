from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBStudent, DBEnrolled, DBClass

def get_student_classes(student_id: int, session: Session) -> list[DBClass]:
    stmt = (
        select(DBClass)
        .join(DBEnrolled)
        .options(selectinload(DBClass.owner))  # Optional: eager load teacher info
        .filter(DBEnrolled.studentID == student_id)
    )
    
    result = session.execute(stmt)
    classes = list(result.scalars().all())
    return classes