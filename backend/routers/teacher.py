
from backend.dependencies import DBSession
from fastapi import APIRouter
from backend.models import ClientErrorResponse
from backend.exceptions import EntityNotFoundException
from backend.models import TeacherResponse, TeacherUpdate
from backend.database.teacher import get_teacher, update_teacher

from typing import Annotated
from fastapi import Depends
from backend.auth import get_firebase_user_from_token

router = APIRouter(prefix="/teacher", tags=["teacher"])

@router.get("/{teacherID}",
            status_code=200,
            response_model=TeacherResponse,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Get a teacher.")
def get_teacher_ID(teacherID: str, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession
                   ) -> TeacherResponse:
    print("We in!")
    teacher = get_teacher(teacherID, session)
    if not teacher:
        raise EntityNotFoundException("teacher", teacherID)
    
    return TeacherResponse(name=teacher.name, username=teacher.userName) # type: ignore

@router.put(
            "/{teacherID}",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Update a teacher.")
def updateTeacher(teacherID: str, update: TeacherUpdate, session: DBSession) -> None:
    update_teacher(teacherID=teacherID, update=update, session=session)
    return None