from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import classroom as classroom_db
from backend.database.schema import DBTeacher, DBUnit, DBClass
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, ClassroomResponse, ClassroomUnit, CreateUnit, ClassroomUpdate,ClassroomUpdateReturn

from backend.exceptions import UnauthorizedException
from typing import Annotated
from fastapi import Depends
from backend.auth import get_firebase_user_from_token

router = APIRouter(prefix="/classroom", tags=["classroom"])

@router.get("/{classID}/units",
            response_model=ClassroomResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve units for the given classroom. Must be the authenticated teacher.")
def get_teacher_home(classID: int, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession) -> ClassroomResponse:
    """ Retrieve all of a teachers classes for their home page.
    
    Args: 
        classID (int): The ID of the classroom to retrieve units for.
        session (DBSession): The database session.
        
    Raises:
        404: If the classroom with the given ID is not found.
        
    Returns:
        ClassroomResponse: A response model containing the units for the classroom.
    """
    #teacherID = classroom_db.get_teacher_id_by_class_id(classID, session)
    #if user["uid"] != teacherID:
    #    raise UnauthorizedException("view classroom")
    
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
             summary="Create a new unit within a class. Must be an authenticated teacher.")
def create_new_unit(classID: int, 
                    unit: CreateUnit, 
                    user: Annotated[dict, Depends(get_firebase_user_from_token)],
                    session: DBSession) -> ClassroomUnit:
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
    teacherID = classroom_db.get_teacher_id_by_class_id(classID, session)
    if user["uid"] != teacherID:
        raise UnauthorizedException("create unit")
    
    db_class = classroom_db.create_new_unit(classID, unit, session)
    return(ClassroomUnit(id=db_class.id, name=db_class.name)) # type: ignore



@router.put("/{classroomID}",
            response_model=ClassroomUpdateReturn,
            status_code= 200,
            responses={404: {"model": ClientErrorResponse},
                       422: {"model": ClientErrorResponse}},
            summary="Update a classrooms's name and/or settings. Must be an authenticated owner of the classroom.")
def update_chat(classroomID: int, 
                classroomUpdate: ClassroomUpdate, 
                user: Annotated[dict, Depends(get_firebase_user_from_token)],
                session: DBSession):
    """Update a classrooms name and/or settings

    Args:
        classroomID (int): ID of the classroom being updated
        classroomUpdate (ClassroomUpdate): The data to update the classroom with
        session (DBSession): The database session.
        
    Raises:
        404: If the classroom with the given ID is not found.
        422: If the classroom update data is invalid.

    Returns:
        ClassroomUpdateReturn: The updated classroom data.
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classroomID, session)
    if user["uid"] != teacherID:
        raise UnauthorizedException("update classroom")
    
    ret = classroom_db.update_classroom(classroomID, classroomUpdate, session)
    return ClassroomUpdateReturn(id=ret.id, name=ret.name, settings=ret.settings, published=ret.published) # type: ignore


@router.delete("/{classroomID}",
               status_code=204,
               responses={404: {"model": ClientErrorResponse}},
               summary="Delete a classroom. Must be the authenticated owner of the classroom.")
def delete_classroom(classroomID: int, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession):
    """Delete a classroom by its ID.

    Args:
        classroomID (int): The ID of the classroom to delete.
        session (DBSession): The database session.

    Raises:
        404: If the classroom with the given ID is not found.

    Returns:
        None
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classroomID, session)
    if user["uid"] != teacherID:
        raise UnauthorizedException("delete classroom")
    
    classroom_db.delete_classroom(classroomID, session)
