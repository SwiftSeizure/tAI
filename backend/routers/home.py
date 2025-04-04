from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import teacher as teacher_db
from backend.database import student as student_db
from backend.database.schema import DBTeacher, DBStudent, DBClass
from backend.dependencies import DBSession
from backend.models import HomeResponse

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/teacher/{accountID}",
            response_model=HomeResponse,
            summary="Retrieve a users name and all of their classes for the home page.")
def get_teacher_home(accountID: int, session: DBSession) -> dict[str, Any]:
    classes = teacher_db.GetTeacherClassListByID(accountID, DBSession) # type: ignore
    teacher = teacher_db.GetTeacherByID(accountID, DBSession) # type: ignore
    return {"name": teacher.name,
            "classes": classes}