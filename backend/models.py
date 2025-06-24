from __future__ import annotations
from pydantic import BaseModel

# Error Response Model ------------------------------------------
class ClientErrorResponse(BaseModel):
    error: str
    message: str

# Home Response Models ------------------------------------------
class HomeResponse(BaseModel):
    classes: list[HomeClass]
    
class HomeClass(BaseModel):
    id: int
    name: str
    
# Home Input Models ---------------------------------------------
class CreateClassroom(BaseModel):
    name: str
    settings: dict
    
# Classroom Response Models -------------------------------------
class ClassroomResponse(BaseModel):
    units: list[ClassroomUnit]
    
class ClassroomUnit(BaseModel):
    id: int
    name: str
    
# Units Response Models ----------------------------------------
class UnitResponse(BaseModel):
    modules: list [UnitModule]
    
class UnitModule(BaseModel):
    id: int
    name: str
    days: list[ModuleDay]
    
class ModuleDay(BaseModel):
    id: int
    name: str

# Module Response Models ---------------------------------------

class ModuleResponse(BaseModel):
    days: list[ModuleDay]

# Day Response Models ----------------------------------------------

class DayAssignmentResponse(BaseModel):
    assignments: list[DayAssignment]

class DayAssignment(BaseModel):
    id: int
    name: str
    filename: str

class DayMaterialResponse(BaseModel):
    materials: list[DayMaterial]

class DayMaterial(BaseModel):
    id: int
    name: str
    filename: str
