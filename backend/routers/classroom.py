from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import classroom as classroom_db
from backend.database.schema import DBTeacher, DBUnit, DBClass
from backend.dependencies import DBSession
from backend.models import ClassroomResponse, ClassroomUnit

router = APIRouter(prefix="/classroom", tags=["classroom"])

@router.get("/{classID}/units",
            response_model=ClassroomResponse,
            summary="Retrieve a users name and all of their classes for the home page.")
def get_teacher_home(classID: int, session: DBSession) -> ClassroomResponse:
    db_units = classroom_db.get_class_units(classID, session) 
    units = [ClassroomUnit(id=c.id, name=c.name) for c in db_units] # type: ignore
    return ClassroomResponse(units=units)