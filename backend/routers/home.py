from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import teacher as teacher_db
from backend.database import student as student_db
from backend.database.schema import DBTeacher, DBStudent, DBClass
from backend.dependencies import DBSession
from backend.models import HomeResponse,HomeClass

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/teacher/{accountID}",
            response_model=HomeResponse,
            summary="Retrieve all of a teachers classes for their home page.")
def get_teacher_home(accountID: int, session: DBSession) -> HomeResponse:
    db_classes = teacher_db.get_teacher_classes(accountID, session) 
    classes = [HomeClass(id=c.id, name=c.name) for c in db_classes] # type: ignore
    return HomeResponse(classes=classes)

@router.get("/student/{accountID}",
            response_model=HomeResponse,
            summary="Retrieve all of a students classes for their home page.")
def get_student_home(accountID: int, session: DBSession) -> HomeResponse:
    db_classes = student_db.get_student_classes(accountID, session) 
    classes = [HomeClass(id=c.id, name=c.name) for c in db_classes] # type: ignore
    return HomeResponse(classes=classes)