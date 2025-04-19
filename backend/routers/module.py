from fastapi import APIRouter, Form
from typing import Any, Annotated
from backend.models import ClientErrorResponse,ModuleDay,ModuleResponse
from backend.dependencies import DBSession
from backend.database.module import get_module_days



router = APIRouter(prefix="/module", tags=["module"])

@router.get("/{moduleID}/days",response_model=ModuleResponse, status_code=200,
            responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve units for the given classroom.")
def getModuleDays(moduleID:int,session:DBSession) -> ModuleResponse:
    db_mods = get_module_days(moduleID,session)
    days = [ModuleDay(id = d.id,name = d.name) for d in db_mods] # type: ignore

    return ModuleResponse(days=days)
