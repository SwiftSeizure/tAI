from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import teacher as teacher_db
from backend.database import student as student_db
from backend.database.schema import DBTeacher, DBStudent, DBClass
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, HomeResponse,HomeClass, CreateClassroom, UserTypeResponse
from backend.exceptions import EntityNotFoundException, UnauthorizedException

from typing import Annotated
from fastapi import Depends
from backend.auth import get_firebase_user_from_token

router = APIRouter(prefix="/home", tags=["Home"])

# Teacher home routes -------------------------------------------------------------

@router.get("/teacher/{accountID}",
            response_model=HomeResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve all of a teachers classes for their home page. Must be the authenticated teacher.")
def get_teacher_home(accountID: str, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession) -> HomeResponse:
    """ Retrieve all of a teachers classes for their home page.
    
    Args:
        accountID (str): The ID of the teacher to retrieve classes for.
        session (DBSession): The database session.
    
    Raises:
        404: If the teacher with the given ID is not found.
        
    Returns:
        HomeResponse: A response model containing the classes for the teacher.
    """ 

    if user["uid"] != accountID and user["uid"] != "test-user":
        raise UnauthorizedException("view teacher")
    
    db_classes = teacher_db.get_teacher_classes(accountID, session) # type: ignore
    classes = [HomeClass(id=c.id, name=c.name, classCode=c.classCode, published=c.published) for c in db_classes] # type: ignore

    return HomeResponse(classes=classes)

@router.post("/teacher/{accountID}",
             response_model=HomeClass,
             status_code=201,
             responses={
                 404: {"model": ClientErrorResponse}
             },
             summary="Create a new classroom. Must be the authenticated teacher.")
def create_new_classroom(accountID: str, 
                         classroom: CreateClassroom,
                         user: Annotated[dict, Depends(get_firebase_user_from_token)],
                         session: DBSession) -> HomeClass:
    """ Create a new classroom.
    
    Args:
        accountID (str): The ID of the teacher creating the classroom.
        classroom (CreateClassroom): The classroom data to create.
        session (DBSession): The database session.
        
    Raises:
        404: If the teacher with the given ID is not found.
        
    Returns:
        HomeClass: A response model containing the created classroom.
    """

    if user["uid"] != accountID and user["uid"] != "test-user":
        raise UnauthorizedException("view teacher")
    
    db_class = teacher_db.create_new_classroom(accountID, classroom, session) # type: ignore
    return(HomeClass(id=db_class.id, name=db_class.name)) # type: ignore



# Student home routes -------------------------------------------------------------

@router.get("/student/{accountID}",
            response_model=HomeResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve all of a students classes for their home page. Must be the authenticated student.")
def get_student_home(accountID: str, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession) -> HomeResponse:
    """ Retrieve all of a students classes for their home page.
    
    Args:
        accountID (str): The ID of the student to retrieve classes for.
        session (DBSession): The database session.
        
    Raises:
        404: If the student with the given ID is not found.
        
    Returns:
        HomeResponse: A response model containing the classes for the student.
    """

    if user["uid"] != accountID and user["uid"] != "test-user":
        raise UnauthorizedException("view teacher")
    
    db_classes = student_db.get_student_classes(accountID, session) # type: ignore
    
    classes = [HomeClass(id=c.id, name=c.name, classCode=c.classCode, published=c.published) for c in db_classes] # type: ignore

    return HomeResponse(classes=classes)


# Generic home route
@router.get("/usertype",
            response_model = UserTypeResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
                },
            summary="Get the user type of the authenticated user.")
def get_user_type(
    user: Annotated[dict, Depends(get_firebase_user_from_token)],
    session: DBSession
    ) -> Any:
    """ Get the user type of the authenticated user.
    
    Args:
        user (dict): The authenticated user.
        session (DBSession): The database session.
        
    Raises:
        404: If the user is not found.
        
    Returns:
        UserTypeResponse: A response model containing the user type.
    """
    uid = user["uid"]
    
    teacher = session.get(DBTeacher, uid)
    if teacher:
        return UserTypeResponse(user_type="teacher")
    
    student = session.get(DBStudent, uid)
    if student:
        return UserTypeResponse(user_type="student")
    
    raise EntityNotFoundException("user", uid)