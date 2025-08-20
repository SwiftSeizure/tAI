from fastapi import APIRouter, Form
from typing import Any, Annotated
from backend.models import ClientErrorResponse,DayAssignmentResponse,DayMaterial,DayAssignment,DayMaterialResponse
from backend.dependencies import DBSession
import backend.database.day as db_day

router = APIRouter(prefix="/day", tags=["day"])


@router.get("/{dayID}/assignments",response_model=DayAssignmentResponse,status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve assignments for the given day.")
def getDayAssignments(dayID:int,session:DBSession) -> DayAssignmentResponse:
        """ Get assignments for a given day

        Args:
                dayID (int): The ID of the day to retrieve assignments for.
                session (DBSession): The database session.
                
        Raises:
                404: If the day with the given ID is not found in the database.
                
        Returns:
                DayAssignmentResposne: A response model containing a list of assignments for the given day.
        """
        db_assignments = db_day.getDayAssignment(dayID,session)
        assignments = [DayAssignment(id = a.id,name = a.name,filename = a.filename) for a in db_assignments] # type: ignore

        return DayAssignmentResponse(assignments = assignments)

@router.get("/{dayID}/materials", response_model=DayMaterialResponse, status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve materials for the given day.")
def getDayMaterials(dayID:int, session:DBSession) -> DayMaterialResponse:
        """ Get materials for a given day.
        
        Args:   
                dayID (int): The ID of the day to retrieve materials for.
                session (DBSession): The database session.
                
        Raises:
                404: If the day with the given ID is not found in the database.
                
        Returns:
                DayMaterialResposne: A response model containing a list of materials for the given day.
        """
        db_materials = db_day.getDayMaterial(dayID,session)
        materials = [DayMaterial(id = m.id, name = m.name, filename = m.filename)for m in db_materials] #type: ignore

        return DayMaterialResponse(materials = materials)
