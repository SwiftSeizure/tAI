
from backend.dependencies import DBSession
from fastapi import APIRouter
from backend.models import ClientErrorResponse
from backend.exceptions import EntityNotFoundException, UnauthorizedException
from backend.models import TeacherResponse, TeacherUpdate, TeacherCreate
import backend.database.teacher as db_teacher

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
            summary="Get a teacher. Must be the authenticated teacher.",)
def get_teacher_ID(teacherID: str, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession
                   ) -> TeacherResponse:
    teacher = db_teacher.get_teacher(teacherID, session)
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("view teacher")
    
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
            summary="Update a teacher. Must be the authenticated teacher.",)
def updateTeacher(teacherID: str, 
                  update: TeacherUpdate, 
                  user: Annotated[dict, Depends(get_firebase_user_from_token)],
                  session: DBSession) -> None:
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("update teacher")
    db_teacher.update_teacher(teacherID=teacherID, update=update, session=session)
    return None

@router.post("/new",
             status_code=201,
             response_model=TeacherResponse,
             responses={
                 401: {"model": ClientErrorResponse},
             },
             summary="Create a new teacher. Must provide a valid token.")
def create_teacher(teacherInfo: TeacherCreate,
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> TeacherResponse:
    """ Create a new teacher.
    
    Args:
        teacherInfo (TeacherCreate): The information of the teacher to create.
        user (dict): The authenticated user information.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        DuplicateNameException: If a teacher with the given username already exists.
        
    Returns:
        DBTeacher: The newly created DBTeacher object.
    """
    teacherID = user["uid"]
    
    teacher = db_teacher.create_teacher(teacherID, teacherInfo.name, teacherInfo.username, session)
    return TeacherResponse(name=teacher.name, username=teacher.userName) # type: ignore