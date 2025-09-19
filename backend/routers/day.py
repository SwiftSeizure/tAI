from fastapi import APIRouter, Form, HTTPException
from typing import Any, Annotated
from backend.models import ClientErrorResponse,DayAssignmentResponse,DayMaterial,DayAssignment,DayMaterialResponse
from backend.dependencies import DBSession
import backend.database.day as db_day
from pathlib import Path

from backend.exceptions import UnauthorizedException
from fastapi import Depends
from backend.auth import get_firebase_user_from_token

router = APIRouter(prefix="/day", tags=["day"])


@router.get("/{dayID}/assignments",response_model=DayAssignmentResponse,status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve assignments for the given day.")
def getDayAssignments(dayID:int,
                      user: Annotated[dict, Depends(get_firebase_user_from_token)],
                      session:DBSession) -> DayAssignmentResponse:
        """ Get assignments for a given day

        Args:
                dayID (int): The ID of the day to retrieve assignments for.
                session (DBSession): The database session.
                
        Raises:
                404: If the day with the given ID is not found in the database.
                
        Returns:
                DayAssignmentResposne: A response model containing a list of assignments for the given day.
        """
        db_assignments = db_day.get_day_assignment(dayID,session)
        assignments = [DayAssignment(id = a.id,name = a.name,filename = a.filename) for a in db_assignments] # type: ignore

        return DayAssignmentResponse(assignments = assignments)

@router.get("/{dayID}/materials", response_model=DayMaterialResponse, status_code=200,responses={
                 404: {"model": ClientErrorResponse}
             },
            summary="Retrieve materials for the given day.")
def getDayMaterials(dayID:int, 
                    user: Annotated[dict, Depends(get_firebase_user_from_token)],
                    session:DBSession) -> DayMaterialResponse:
        """ Get materials for a given day.
        
        Args:   
                dayID (int): The ID of the day to retrieve materials for.
                session (DBSession): The database session.
                
        Raises:
                404: If the day with the given ID is not found in the database.
                
        Returns:
                DayMaterialResposne: A response model containing a list of materials for the given day.
        """
        db_materials = db_day.get_day_material(dayID,session)
        materials = [DayMaterial(id = m.id, name = m.name, filename = m.filename)for m in db_materials] #type: ignore

        return DayMaterialResponse(materials = materials)


# TODO handle exceptions here
@router.delete("/{dayId}", status_code=204, 
               summary="Delete a day and all its associated data.")
def delete_day(dayID: int, 
               user: Annotated[dict, Depends(get_firebase_user_from_token)],
               session: DBSession):
        """ Delete a day and all its associated data.
        Args:
                dayId (int): The ID of the day to delete.
                session (DBSession): The database session.
        Raises:
                404: If the day with the given ID is not found in the database.
                401: If the user is not authorized to delete the day.
        Returns:
                None
        """
        user_id = user["uid"]
        teacher_id = db_day.get_teacher_by_day_id(dayID, session)
        if user_id != teacher_id and user_id != "test-user":
                raise UnauthorizedException("delete day")    
                
        try:
                db_day.delete_day(dayID, session)
        except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        return None
