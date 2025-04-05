from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBTeacher, DBClass

def GetTeacherClassListByID(accountID: int, session: Session) -> list[DBClass]:
    print(DBTeacher)
    teacher = session.query(DBTeacher).options(selectinload(DBTeacher.classes)).filter(DBTeacher.id == accountID).first()
    if teacher:
        return teacher.classes
    return [] # TODO error


def GetTeacherByID(accountID: int, session: Session) -> DBTeacher:
    Teacher  = session.get(DBTeacher, accountID)
    # if Teacher is None: 
    #     raise EntityNotFound("Teacher", accountID)
    return Teacher
    