from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import unit as unit_db
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, UnitResponse,UnitModule, CreateModule, ModuleDay

router = APIRouter(prefix="/unit", tags=["Unit"])


@router.get("/{unitID}/modules",
            response_model=UnitResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve the modules and days for a given unit.")
def get_unit_modules(unitID: int, session: DBSession) -> UnitResponse:
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
            summary="Create a new module for a given unit.")
def create_new_module(unitID: int, module: UnitModule, session: DBSession) -> UnitResponse:
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
    unit_db.create_new_module(unitID, module, session)
    return get_unit_modules(unitID, session)