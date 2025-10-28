from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import classroom as classroom_db
from backend.database.schema import DBTeacher, DBUnit, DBClass
from backend.dependencies import DBSession
from backend.models import ClassroomStudentsResponse, ClientErrorResponse, ClassroomResponse, ClassroomUnit, CreateUnit, ClassroomNameUpdate,ClassroomSettingsUpdate,ClassroomUpdateReturn, CanvasData

from backend.exceptions import UnauthorizedException
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
def get_class_units(classID: int, 
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
    
    db_units = classroom_db.get_class_units(classID, session) 
    units = [ClassroomUnit(id=u.id, name=u.name, published=u.published) for u in db_units] # type: ignore
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
    """ Create a new unit within a class. Must be an authenticated teacher
    
    Args:
        accountID (int): The ID of the teacher creating the classroom.
        classroom (CreateClassroom): The classroom data to create.
        session (DBSession): The database session.
        
    Raises:
        404: If the teacher with the given ID is not found.
        
    Returns:
        ClassroomUnit: A response model containing the created unit.
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classID, session)
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("create unit")
    
    db_unit = classroom_db.create_new_unit(classID, unit, session)
    return(ClassroomUnit(id=db_unit.id, name=db_unit.name, published=db_unit.published)) # type: ignore


@router.post("/{classID}/canvas",
             status_code=201,
             responses={
                 404: {"model": ClientErrorResponse},
             },
             summary="Create a new Canvas API key for the classroom. Must be an authenticated teacher.")
def add_canvas_api_key(classID: int, 
                        canvasData: CanvasData, 
                        user: Annotated[dict, Depends(get_firebase_user_from_token)],
                        session: DBSession):
    """ Add a new Canvas API key for the classroom.

    Args:
        classID (int): The ID of the classroom to add the API key to.
        api_key (CanvasAPIKey): The API key data to create.
        session (DBSession): The database session.

    Raises:
        404: If the teacher with the given ID is not found.

    Returns:
        Nothing
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classID, session)
    if user["uid"] != teacherID:
        raise UnauthorizedException("create canvas API key")

    classroom_db.add_canvas_api_key(classID, canvasData, session)


@router.put("/name/{classroomID}",
            response_model=ClassroomUpdateReturn,
            status_code= 200,
            responses={404: {"model": ClientErrorResponse},
                       422: {"model": ClientErrorResponse}},
            summary="Update a classrooms's name. Must be an authenticated owner of the classroom.")
def update_classroom_name(classroomID: int, 
                newName: ClassroomNameUpdate, 
                user: Annotated[dict, Depends(get_firebase_user_from_token)],
                session: DBSession):
    """Update a classrooms name 

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
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("update classroom")
    
    ret = classroom_db.update_classroom_name(classroomID, newName, session)
    return ClassroomUpdateReturn(id=ret.id, name=ret.name, settings=ret.settings, published=ret.published) # type: ignore

@router.put("/settings/{classroomID}",
            response_model=ClassroomUpdateReturn,
            status_code= 200,
            responses={404: {"model": ClientErrorResponse},
                       422: {"model": ClientErrorResponse}},
            summary="Update a classrooms's settings. Must be an authenticated owner of the classroom.")
def update_classroom_settings(classroomID: int, 
                settings: ClassroomSettingsUpdate, 
                user: Annotated[dict, Depends(get_firebase_user_from_token)],
                session: DBSession):
    """Update a classrooms settings.

    Args:
        classroomID (int): ID of the classroom being updated.
        classroomUpdate (ClassroomUpdate): The data to update the classroom with
        session (DBSession): The database session.
        
    Raises:
        404: If the classroom with the given ID is not found.
        422: If the classroom update data is invalid.

    Returns:
        ClassroomUpdateReturn: The updated classroom data.
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classroomID, session)
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("update classroom")
    
    ret = classroom_db.update_classroom_settings(classroomID, settings, session)
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
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("delete classroom")
    
    classroom_db.delete_classroom(classroomID, session)


@router.delete("/{classroomID}/{studentID}",
            status_code=204,
            responses={404: {"model": ClientErrorResponse}},
            summary="Delete a student from a classroom.")
def delete_student_from_classroom(classroomID: int, 
                                  studentID: int, 
                                  user: Annotated[dict, Depends(get_firebase_user_from_token)],
                                  session: DBSession):
    """Delete a student from a classroom by its ID.
    Args:
        classroomID (int): The ID of the classroom to delete the student from.
        studentID (int): The ID of the student to delete.
        session (DBSession): The database session.
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classroomID, session)
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("delete student from classroom.")
    
    classroom_db.delete_student_from_classroom(classroomID, studentID, session)

@router.get("/{classroomID}/students",
            response_model=ClassroomStudentsResponse,
            status_code=200,
            responses={404: {"model": ClientErrorResponse}},
            summary="Get all students in a classroom.")
def get_students_in_classroom(classroomID: int, 
                              user: Annotated[dict, Depends(get_firebase_user_from_token)],
                              session: DBSession):
    """Get all students in a classroom by its ID.
    Args:
        classroomID (int): The ID of the classroom to get the students from
        session (DBSession): The database session.

    Raises:
        404: If the classroom with the given ID is not found.

    Returns:
        ClassroomStudentsResponse: A response model containing the students in the classroom, in alphabetical order.
    """
    students = classroom_db.get_students_in_classroom(classroomID, session)
    return ClassroomStudentsResponse(students=students)

@router.put("/{classroomID}/publish",
            status_code=204,
            responses={404: {"model": ClientErrorResponse}},
            summary="Update a classrooms's published status.")
def publish_classroom(classroomID: int, 
                      user: Annotated[dict, Depends(get_firebase_user_from_token)],
                      session: DBSession):
    """Flip a classrooms's published status.
    Args:
        classroomID (int): The ID of the classroom to update the published status of.
        session (DBSession): The database session.
    """
    teacherID = classroom_db.get_teacher_id_by_class_id(classroomID, session)
    if user["uid"] != teacherID and user["uid"] != "test-user":
        raise UnauthorizedException("change publish status of a classroom")
    
    classroom_db.update_classroom_published_status(classroomID, session)
    return None

