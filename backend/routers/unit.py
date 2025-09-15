from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import unit as unit_db
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, UnitResponse, UnitUpdate, UnitModule, CreateModule, ModuleDay

from typing import Annotated
from fastapi import Depends
from backend.auth import get_firebase_user_from_token
from backend.exceptions import UnauthorizedException

router = APIRouter(prefix="/unit", tags=["Unit"])


@router.get("/{unitID}/modules",
            response_model=UnitResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve the modules and days for a given unit. Must be an authenticated user.")
def get_unit_modules(unitID: int, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession) -> UnitResponse:
    """ Retrieve the modules and days for a given unit.
 
    Args:
        unitID (int): The ID of the unit to retrieve modules for.
        session (DBSession): The database session.
        
    Raises:
        404: If the unit with the given ID is not found.
            
    Returns:
        UnitResponse: A response model containing the modules and their days.
    """
    db_modules = unit_db.get_unit_modules(unitID, session) 
    
    modules = []
    for m in db_modules:
        modules.append(UnitModule(
            id=m.id,   # type: ignore
            name=m.name,   # type: ignore
            days=[ModuleDay(id=d.id, name=d.name) for d in m.days]
        ))

    return UnitResponse(modules=modules)


@router.post("/{unitID}/module",
            response_model=UnitResponse,
            status_code=201,
            responses={
                 404: {"model": ClientErrorResponse},
                 409: {"model": ClientErrorResponse},
             },
            summary="Create a new module for a given unit. Must be an authenticated owner of the unit.")
def create_new_module(unitID: int, 
                      user: Annotated[dict, Depends(get_firebase_user_from_token)],
                      module: CreateModule, session: DBSession) -> UnitResponse:
    """ 
    Create a new module for a given unit.
 
    Args:
        unitID (int): The ID of the unit to create a module for.
        module (UnitModule): The module data to create.
        session (DBSession): The database session.
        
    Raises:
        404: If the unit with the given ID is not found.
        409: If the module with the given name already exists in the unit.
            
    Returns:
        UnitResponse: A response model containing the name and ID of the created module.
    """
    user_id = user["uid"] 
    teacherID = unit_db.get_teacher_id_by_unit_id(unitID, session)
    if user_id != teacherID:
        raise UnauthorizedException("create module")
    
    module = unit_db.create_new_module(unitID, module, session)
    return get_unit_modules(unitID, user, session)



@router.put("/{unitID}",
            status_code= 204,
            responses={404: {"model": ClientErrorResponse},
                       422: {"model": ClientErrorResponse}},
            summary="Update a unit's name and/or settings. Must be an authenticated owner of the unit.")
def update_unit(unitID: int, 
                user: Annotated[dict, Depends(get_firebase_user_from_token)],
                unitUpdate: UnitUpdate, session: DBSession):
    """
    Update a unit's name and/or settings.

    Args:
        unitID (int): The ID of the unit to update.
        unitUpdate (UnitUpdate): The data to update the unit with.
        session (DBSession): The database session.
        
    Raises:
        404: If the unit with the given ID is not found.
        422: If the provided data is invalid.
    
    Returns:
        None
    """
    user_id = user["uid"] 
    teacherID = unit_db.get_teacher_id_by_unit_id(unitID, session)
    if user_id != teacherID:
        raise UnauthorizedException("edit module")
    
    unit_db.update_unit(unitID, unitUpdate, session)
    



@router.delete("/{unitID}",
               status_code=204,
               responses={404: {"model": ClientErrorResponse}},
               summary="Delete a unit. Must be an authenticated owner of the unit.")
def delete_classroom(unitID: int, 
                     user: Annotated[dict, Depends(get_firebase_user_from_token)],
                     session: DBSession):
    """Delete a unit by its ID.
    Args:
        unitID (int): The ID of the unit to delete.
        session (DBSession): The database session.
    Raises:
        404: If the unit with the given ID is not found.
    Returns:
        None
    """
    user_id = user["uid"] 
    teacherID = unit_db.get_teacher_id_by_unit_id(unitID, session)
    if user_id != teacherID:
        raise UnauthorizedException("delete module")
    
    unit_db.delete_unit(unitID, session)