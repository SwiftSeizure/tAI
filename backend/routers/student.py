from backend.dependencies import DBSession
from fastapi import APIRouter
from backend.models import ClientErrorResponse, AddEnrollment,StudentUpdate, StudentResponse
from backend.database.student import enroll, updateStudent,get_student  
from backend.exceptions import EntityNotFoundException, InvalidClassCodeException



router = APIRouter(prefix="/student", tags=["student"])

@router.post("/enroll",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
                
            },
            summary="Enroll a student in a class.")
def enroll_student(update:AddEnrollment , session: DBSession) -> None:
    enroll(studentID=update.studentID, classCode=update.classCode, session=session)

    return None

@router.put(
            "/{studentID}",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Update a student.")
def update_student(studentID: int, update: StudentUpdate, session: DBSession) -> None:
    updateStudent(studentID=studentID, update=update, session=session)
    return None

@router.get("/{studentID}",
            status_code=200,
            response_model=StudentResponse,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Get a student.")
def get_student_ID(studentID: int, session: DBSession) -> StudentResponse:
    student = get_student(studentID, session)
    if not student:
        raise EntityNotFoundException("student", studentID)
    
    return StudentResponse(name=student.name, username=student.userName)