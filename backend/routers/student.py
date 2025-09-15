from backend.dependencies import DBSession
from fastapi import APIRouter
from backend.models import ClientErrorResponse, AddEnrollment,StudentUpdate, StudentResponse
from backend.database.student import enroll, updateStudent,get_student  
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException, UnauthorizedException

from typing import Annotated
from fastapi import Depends
from backend.auth import get_firebase_user_from_token


router = APIRouter(prefix="/student", tags=["student"])

@router.put("/enroll",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Enroll a student in a class. Must be an authenticated student.")
def enroll_student(update:AddEnrollment , 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> None:
    
    if user["uid"] != update.studentID:
        raise UnauthorizedException("enroll student")
    
    enroll(studentID=update.studentID, classCode=update.classCode, session=session) # type: ignore

    return None

@router.put(
            "/{studentID}",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Update a student. Must be an authenticated student.")
def update_student(studentID: int, 
                   update: StudentUpdate, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> None:
    
    if user["uid"] != studentID:
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
def get_student_ID(studentID: int, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> StudentResponse:
    
    if user["uid"] != studentID:
        raise UnauthorizedException("view student")

    student = get_student(studentID, session) # type: ignore
    if not student:
        raise EntityNotFoundException("student", studentID) # type: ignore
    
    return StudentResponse(name=student.name, username=student.userName) # type: ignore