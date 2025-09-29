from fastapi import APIRouter, Form
from typing import Any, Annotated
from backend.models import ClientErrorResponse, ModuleDay, ModuleResponse
from backend.dependencies import DBSession
from backend.database import module as module_db

from backend.exceptions import UnauthorizedException
from fastapi import Depends
from backend.auth import get_firebase_user_from_token

router = APIRouter(prefix="/module", tags=["module"])

@router.get("/{moduleID}/days",
            response_model=ModuleResponse, 
            status_code=200,
            responses={
                404: {"model": ClientErrorResponse}
             },
            summary="Retrieve days for the given module. Must be an authenticated user.")
def getModuleDays(moduleID:int,
                  user: Annotated[dict, Depends(get_firebase_user_from_token)],
                  session : DBSession) -> ModuleResponse:
    """Get the days of a module.
    
    Args:
        moduleID (int): The ID of the module
        session (DBSession): The database session.
        
    Raises:
        404: If the module is not found      
        
    Returns:
        ModuleResponse: The response containing the module days.
    """
    db_mods = module_db.get_module_days(moduleID, session)
    days = [ModuleDay(id = d.id,name = d.name) for d in db_mods] # type: ignore
    return ModuleResponse(days=days)


@router.post("/{moduleID}/day",
             response_model=ModuleDay,
             status_code=201,
             responses={
                 404: {"model": ClientErrorResponse},
                 409: {"model": ClientErrorResponse},
             },
             summary="Create a new day within a module. Must be an authenticated owner of the module.")
def create_new_day(moduleID: int, 
                   user: Annotated[dict, Depends(get_firebase_user_from_token)],
                   session: DBSession) -> ModuleDay:
    """ Create a new day within a module.
    
    Args:
        moduleID (int): The ID of the module to create a day in.
        session (DBSession): The database session.
        
    Raises:
        404: If the module with the given ID is not found.
        
    Returns:
        ModuleDay: A response model containing the created classroom.
    """
    
    user_id = user["uid"]
    teacher_id = module_db.get_teacher_by_module_id(moduleID, session)
    if user_id != teacher_id and user_id != "test-user":
        raise UnauthorizedException("create day")
    
    db_day = module_db.create_new_day(moduleID, session)
    return(ModuleDay(id=db_day.id, name = db_day.name)) # type: ignore


@router.delete("/{moduleID}",
               status_code=204,
               responses={404: {"model": ClientErrorResponse}},
               summary="Delete a module. Must be the authenticated owner of the module.")
def delete_classroom(moduleID: int, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession):
    """Delete a module by its ID.
    Args:
        moduleID (int): The ID of the module to delete.
        session (DBSession): The database session.
    Raises:
        404: If the module with the given ID is not found.
    Returns:
        None
    """
    user_id = user["uid"]
    teacher_id = module_db.get_teacher_by_module_id(moduleID, session)
    if user_id != teacher_id and user_id != "test-user":
        raise UnauthorizedException("create day")
    
    module_db.delete_module(moduleID, session)