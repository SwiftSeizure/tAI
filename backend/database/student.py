from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBStudent, DBEnrolled, DBClass
from backend.exceptions import EntityNotFoundException

def get_student(studentID: int, session: Session) -> DBStudent | None:
    stmt = select(DBStudent).filter(DBStudent.id == studentID)
    return session.execute(stmt).scalar_one_or_none()

def get_student_classes(studentID: int, session: Session) -> list[DBClass]:
    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)
    
    stmt = (
        select(DBClass)
        .join(DBEnrolled)
        .options(selectinload(DBClass.owner))  # Optional: eager load teacher info
        .filter(DBEnrolled.studentID == studentID)
    )
    
    result = session.execute(stmt)
    classes = list(result.scalars().all())
    return classes