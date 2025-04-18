from fastapi import APIRouter, Form
from typing import Any, Annotated

from backend.database import unit as unit_db
from backend.dependencies import DBSession
from backend.models import ClientErrorResponse, UnitResponse,UnitModule, ModuleDay

router = APIRouter(prefix="/unit", tags=["Unit"])

@router.get("/{unitID}/modules",
            response_model=UnitResponse,
            status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve the modules and days for a given unit.")
def get_unit_modules(unitID: int, session: DBSession) -> UnitResponse:
    db_modules = unit_db.get_unit_modules(unitID, session) 

    modules = []
    for m in db_modules:
        modules.append(UnitModule(
            id=m.id,   # type: ignore
            name=m.name,   # type: ignore
            days=[ModuleDay(id=d.id, name=d.name) for d in m.days]
        ))

    return UnitResponse(modules=modules)