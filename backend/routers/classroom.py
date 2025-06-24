from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import classroom as classroom_db
from backend.database.schema import DBTeacher, DBUnit, DBClass
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, ClassroomResponse, ClassroomUnit

router = APIRouter(prefix="/classroom", tags=["classroom"])

@router.get("/{classID}/units",
            response_model=ClassroomResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve units for the given classroom.")
def get_teacher_home(classID: int, session: DBSession) -> ClassroomResponse:
    """ Retrieve all of a teachers classes for their home page.
    
    Args: 
        classID (int): The ID of the classroom to retrieve units for.
        session (DBSession): The database session.
        
    Raises:
        404: If the classroom with the given ID is not found.
        
    Returns:
        ClassroomResponse: A response model containing the units for the classroom.
    """
    db_units = classroom_db.get_class_units(classID, session) 
    units = [ClassroomUnit(id=c.id, name=c.name) for c in db_units] # type: ignore
    return ClassroomResponse(units=units)