from fastapi import APIRouter, Form
from typing import Any, Annotated
from backend.models import ClientErrorResponse,DayAssignmentResposne,DayMaterial,DayAssignment,DayMaterialResposne
from backend.dependencies import DBSession
from backend.database.day import getDayAssignment, getDayMaterial

router = APIRouter(prefix="/day", tags=["day"])

@router.get("/{dayID}/assignments",response_model=DayAssignmentResposne,status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve assignments for the given day.")
def getDayAssignments(dayID:int,session:DBSession) -> DayAssignmentResposne:
        db_assignments = getDayAssignment(dayID,session)
        assignments = [DayAssignment(id = a.id,name = a.name,path = a.path) for a in db_assignments] # type: ignore

        return DayAssignmentResposne(assignments = assignments)

@router.get("/{dayID}/materials", response_model=DayMaterialResposne, status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve materials for the given day.")
def getDayMaterials(dayID:int, session:DBSession) -> DayMaterialResposne:
        db_materials = getDayMaterial(dayID,session)
        materials = [DayMaterial(id = m.id, name = m.name, path = m.path)for m in db_materials] #type: ignore

        return DayMaterialResposne(materials = materials)

