from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import classroom as classroom_db
from backend.database.schema import DBTeacher, DBUnit, DBClass
from backend.dependencies import DBSession
from backend.models import ClassroomStudentsResponse, ClientErrorResponse, ClassroomResponse, ClassroomUnit, CreateUnit, ClassroomUpdate,ClassroomUpdateReturn

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
            response_model=ClassroomUpdateReturn,
            status_code= 200,
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
        ClassroomUpdateReturn: The updated classroom data.
    """
    ret = classroom_db.update_classroom(classroomID, classroomUpdate, session)
    return ClassroomUpdateReturn(id=ret.id, name=ret.name, settings=ret.settings, published=ret.published) # type: ignore


@router.delete("/{classroomID}",
               status_code=204,
               responses={404: {"model": ClientErrorResponse}},
               summary="Delete a classroom.")
def delete_classroom(classroomID: int, session: DBSession):
    """Delete a classroom by its ID.

    Args:
        classroomID (int): The ID of the classroom to delete.
        session (DBSession): The database session.

    Raises:
        404: If the classroom with the given ID is not found.

    Returns:
        None
    """
    classroom_db.delete_classroom(classroomID, session)


@router.delete("/{classroomID}/{studentID}",
            status_code=204,
            responses={404: {"model": ClientErrorResponse}},
            summary="Delete a student from a classroom.")
def delete_student_from_classroom(classroomID: int, studentID: int, session: DBSession):
    """Delete a student from a classroom by its ID.
    Args:
        classroomID (int): The ID of the classroom to delete the student from.
        studentID (int): The ID of the student to delete.
        session (DBSession): The database session.
    """
    classroom_db.delete_student_from_classroom(classroomID, studentID, session)

@router.get("/{classroomID}/students",
            response_model=ClassroomStudentsResponse,
            status_code=200,
            responses={404: {"model": ClientErrorResponse}},
            summary="Get all students in a classroom.")
def get_students_in_classroom(classroomID: int, session: DBSession):
    """Get all students in a classroom by its ID.
    Args:
        classroomID (int): The ID of the classroom to get the students from
        session (DBSession): The database session.

    Raises:
        404: If the classroom with the given ID is not found.

    Returns:
        ClassroomStudentsResponse: A response model containing the students in the classroom.
    """
    students = classroom_db.get_students_in_classroom(classroomID, session)
    return ClassroomStudentsResponse(students=students)

@router.put("/{classroomID}/publish",
            status_code=204,
            responses={404: {"model": ClientErrorResponse}},
            summary="Update a classrooms's published status.")
def publish_classroom(classroomID: int, session: DBSession):
    """Update a classrooms's published status.
    Args:
        classroomID (int): The ID of the classroom to update the published status of.
        session (DBSession): The database session.
    """
    classroom_db.update_classroom_published_status(classroomID, True, session)
    return None

@router.put("/{classroomID}/unpublish",
            status_code=204,
            responses={404: {"model": ClientErrorResponse}},
            summary="Update a classrooms's published status.")
def unpublish_classroom(classroomID: int, session: DBSession):
    """Update a classrooms's published status.
    Args:
        classroomID (int): The ID of the classroom to update the published status of.
        session (DBSession): The database session.
    """
    classroom_db.update_classroom_published_status(classroomID, False, session)
    return None