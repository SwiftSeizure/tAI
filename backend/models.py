from __future__ import annotations
from pydantic import BaseModel
from typing import Optional
from backend.database.schema import DBMessage, DBResponse, DBConversation

# Error Response Model --------------------------------------------
class ClientErrorResponse(BaseModel):
    error: str
    message: str

    
# Home Input Models -----------------------------------------------
class CreateClassroom(BaseModel):
    name: str
    settings: dict
# Home Response Models --------------------------------------------
class HomeResponse(BaseModel):
    classes: list[HomeClass]
class HomeClass(BaseModel):
    id: int
    name: str


# Classroom Input Models ------------------------------------------
class ClassroomUpdate(BaseModel):
    name: str
    settings: dict
class CreateUnit(BaseModel):
    name: str
    settings: dict
# Classroom Response Models ---------------------------------------
class ClassroomResponse(BaseModel):
    units: list[ClassroomUnit]
class ClassroomUnit(BaseModel):
    id: int
    name: str
    
    
# Unit Input Models -----------------------------------------------
class CreateModule(BaseModel):
    name: str
    settings: dict
class UnitUpdate(BaseModel):
    name: str
    settings: dict
# Unit Response Models --------------------------------------------
class UnitResponse(BaseModel):
    modules: list [UnitModule]
class UnitModule(BaseModel):
    id: int
    name: str
    days: list[ModuleDay]
class ModuleDay(BaseModel):
    id: int
    name: str


# Module Input Models ----------------------------------------------
# Module Response Models -------------------------------------------
class ModuleResponse(BaseModel):
    days: list[ModuleDay]


# Day Input Models -------------------------------------------------
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

# Enrollment Input Models -----------------------------------

class AddEnrollment(BaseModel):
    studentID: int
    classCode: int

# Teacher Input Models -----------------------------------
class TeacherUpdate(BaseModel):
    name : Optional[str] = None
    username : Optional[str] = None

# Teacher Response Models -----------------------------------

class TeacherResponse(BaseModel):
    name: str
    username: str
    


# Student Input Models -----------------------------------
class StudentUpdate(BaseModel):
    name : Optional[str] = None
    username : Optional[str] = None

# Student Response Models -----------------------------------
class StudentResponse(BaseModel):
    name: str
    username: str
    

class StudentClass(BaseModel):
    id: int
    name: str
    classCode: int
    published: bool
    settings: dict


# Chat Response Models -----------------------------------
class ChatResponse(BaseModel):
    studentID: int
    conversationID: int
    messages: list[ChatMessage]
    responses: list[ChatResponseMessage]

class ChatMessage(BaseModel):
    id: int
    content: str
    conversationID: int

class ChatResponseMessage(BaseModel):
    id: int
    content: str
    conversationID: int
