from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import classroom as classroom_db
from backend.database.schema import DBTeacher, DBUnit, DBClass
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, ClassroomResponse, ClassroomUnit, CreateUnit, ClassroomUpdate

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


@router.post("/{classID}/unit",
             response_model=ClassroomUnit,
             status_code=201,
             responses={
                 404: {"model": ClientErrorResponse},
                 409: {"model": ClientErrorResponse},
             },
             summary="Create a new unit within a class.")
def create_new_unit(classID: int, unit: CreateUnit, session: DBSession) -> ClassroomUnit:
    """ Create a new unit within a class.
    
    Args:
        accountID (int): The ID of the teacher creating the classroom.
        classroom (CreateClassroom): The classroom data to create.
        session (DBSession): The database session.
        
    Raises:
        404: If the teacher with the given ID is not found.
        
    Returns:
        HomeClass: A response model containing the created classroom.
    """
    db_class = classroom_db.create_new_unit(classID, unit, session)
    return(ClassroomUnit(id=db_class.id, name=db_class.name)) # type: ignore



@router.put("/{classroomID}",
            status_code= 204,
            responses={404: {"model": ClientErrorResponse},
                       422: {"model": ClientErrorResponse}},
            summary="Update a classrooms's name and/or settings.")
def update_chat(classroomID: int, classroomUpdate: ClassroomUpdate, session: DBSession):
    """Update a classrooms name and/or settings

    Args:
        classroomID (int): ID of the classroom being updated
        classroomUpdate (ClassroomUpdate): The data to update the classroom with
        session (DBSession): The database session.
        
    Raises:
        404: If the classroom with the given ID is not found.
        422: If the classroom update data is invalid.

    Returns:
        None
    """
    classroom_db.update_classroom(classroomID, classroomUpdate, session)