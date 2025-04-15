from sqlalchemy import select
from sqlalchemy.orm import selectinload, Session
from backend.database.schema import DBClass, DBUnit

def get_class_units(class_id: int, session: Session) -> list[DBClass]:
    # Using select statement
    stmt = (
        select(DBClass)
        .filter(DBClass.id == class_id)
        .options(selectinload(DBClass.units))
    )
    class_ = session.execute(stmt).scalar_one_or_none()
        
    return list(class_.units) if class_ else []