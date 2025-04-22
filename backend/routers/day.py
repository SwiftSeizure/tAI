from fastapi import APIRouter, Form
from typing import Any, Annotated
from backend.models import ClientErrorResponse,DayAssignmentResposne,DayMaterial,DayAssignment,DayMaterialResposne
from backend.dependencies import DBSession
import backend.database.day as db_day

router = APIRouter(prefix="/day", tags=["day"])

""" Get assignments for a given day

        Args:
                dayID (int): The ID of the day to retrieve assignments for.
                session (DBSession): The database session.
        Returns:
                DayAssignmentResposne: A response model containing a list of assignments for the given day.
        Raises:
                404: If the day with the given ID is not found in the database.
                
"""
@router.get("/{dayID}/assignments",response_model=DayAssignmentResposne,status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve assignments for the given day.")
def getDayAssignments(dayID:int,session:DBSession) -> DayAssignmentResposne:
        db_assignments = db_day.getDayAssignment(dayID,session)
        assignments = [DayAssignment(id = a.id,name = a.name,filename = a.filename) for a in db_assignments] # type: ignore

        return DayAssignmentResposne(assignments = assignments)

@router.get("/{dayID}/materials", response_model=DayMaterialResposne, status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve materials for the given day.")
def getDayMaterials(dayID:int, session:DBSession) -> DayMaterialResposne:
        db_materials = db_day.getDayMaterial(dayID,session)
        materials = [DayMaterial(id = m.id, name = m.name, filename = m.filename)for m in db_materials] #type: ignore

        return DayMaterialResposne(materials = materials)

