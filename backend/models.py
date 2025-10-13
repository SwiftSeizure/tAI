from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.database.schema import DBMessage, DBResponse, DBConversation, DBStudent

# Error Response Model --------------------------------------------
class ClientErrorResponse(BaseModel):
    error: str
    message: str

    
# Home Input Models -----------------------------------------------
class CreateClassroom(BaseModel):
    name: str
    settings: dict
    published: bool
    
# Home Response Models --------------------------------------------
class HomeResponse(BaseModel):
    classes: list[HomeClass]
    
class HomeClass(BaseModel):
    id: int
    name: str
    classCode: Optional[str] = None
    published: Optional[bool] = None
    
class UserTypeResponse(BaseModel):
    user_type: str  # "teacher" or "student"


# Classroom Input Models ------------------------------------------
class ClassroomNameUpdate(BaseModel):
    name: str
    
class ClassroomSettingsUpdate(BaseModel):
    settings: dict

class ClassroomUpdateReturn(BaseModel):
    id: int
    name: str
    settings: dict
    published: bool

class CreateUnit(BaseModel):
    name: str
    settings: dict
    published: bool
    
class CanvasAPIKey(BaseModel):
    api_key: str

# Classroom Response Models ---------------------------------------
class ClassroomResponse(BaseModel):
    units: list[ClassroomUnit]

class ClassroomStudentsResponse(BaseModel):
    students: list[ClassroomStudent]

class ClassroomStudent(BaseModel):
    id: str
    name: str
    username: str


class ClassroomUnit(BaseModel):
    id: int
    name: str
    published: bool
    
    
# Unit Input Models -----------------------------------------------
class CreateModule(BaseModel):
    name: str
    settings: Dict[str, Any]
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
class CreateDay(BaseModel):
    name: Optional[str] = None
    
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
    studentID: str
    classCode: str

# Teacher Input Models -----------------------------------
class TeacherUpdate(BaseModel):
    name : Optional[str] = None
    username : Optional[str] = None
class TeacherCreate(BaseModel):
    name : str
    username : str

# Teacher Response Models -----------------------------------

class TeacherResponse(BaseModel):
    name: str
    username: str
    


# Student Input Models -----------------------------------
class StudentUpdate(BaseModel):
    name : Optional[str] = None
    username : Optional[str] = None
class StudentCreate(BaseModel):
    name : str
    username : str

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

    model_config = {
        "from_attributes": True
    }



class ChatResponseMessage(BaseModel):
    id: int
    content: str
    conversationID: int

    model_config = {
        "from_attributes": True
    }
