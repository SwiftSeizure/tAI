from backend.dependencies import DBSession
from fastapi import APIRouter
from backend.models import ClientErrorResponse, AddEnrollment
from backend.database.student import enroll


router = APIRouter(prefix="/student", tags=["student"])

@router.put("/{classID}/enroll",
            status_code=204,
            responses={
                404: {"model": ClientErrorResponse},
                409: {"model": ClientErrorResponse},
            },
            summary="Enroll a student in a class.")
def enroll_student(classID: int,update:AddEnrollment , session: DBSession) -> None:
    enroll(studentID=update.studentID, classID=classID, classCode=update.classCode, session=session)

    return None