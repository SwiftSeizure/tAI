from backend.dependencies import DBSession
from fastapi import APIRouter
from backend.models import ClientErrorResponse, AddEnrollment,StudentUpdate, StudentResponse
import backend.database.student as db_student
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException, UnauthorizedException

from typing import Annotated
from fastapi import Depends
from backend.auth import get_firebase_user_from_token


router = APIRouter(prefix="/student", tags=["student"])

@router.put("/enroll",
            status_code=200,

            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },

            summary="Enroll a student in a class. Must be an authenticated student. Returns the ID of the class that got jointed.")
def enroll_student(update:AddEnrollment , 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> int:
    
    if user["uid"] != update.studentID and user["uid"] != "test-user":
        raise UnauthorizedException("enroll student")
    
    return enroll(studentID=update.studentID, classCode=update.classCode, session=session) # type: ignore
    


@router.put(
            "/{studentID}",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Update a student. Must be an authenticated student.")
def update_student(studentID: str, 
                   update: StudentUpdate, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> None:
    
    if user["uid"] != studentID and user["uid"] != "test-user":
        raise UnauthorizedException("update student")
    
    updateStudent(studentID=studentID, update=update, session=session) # type: ignore
    return None


@router.get("/{studentID}",
            status_code=200,
            response_model=StudentResponse,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Get a student. Must be an authenticated student.")
def get_student_ID(studentID: str, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> StudentResponse:
    
    if user["uid"] != studentID and user["uid"] != "test-user":
        raise UnauthorizedException("view student")

    student = get_student(studentID, session) # type: ignore
    if not student:
        raise EntityNotFoundException("student", studentID) # type: ignore
    
    return StudentResponse(name=student.name, username=student.userName) # type: ignore


@router.post("/new",
             status_code=201,
             response_model=StudentResponse,
             responses={
                 401: {"model": ClientErrorResponse},
             },
             summary="Create a new student. Must provide a valid token.")
def create_teacher(studemtInfo: StudentCreate,
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> StudentResponse:
    """ Create a new student.
    
    Args:
        studentInfo (StudentCreate): The information of the student to create.
        user (dict): The authenticated user information.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        DuplicateNameException: If a student with the given username already exists.
        
    Returns:
        DBTStudent: The newly created DBStudent object.
    """
    studentID = user["uid"]
    
    teacher = db_student.create_student(studentID, studentInfo.name, studentInfo.username, session)
    return StudentResponse(name=teacher.name, username=teacher.userName) # type: ignore