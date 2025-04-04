from __future__ import annotations
from pydantic import BaseModel


# Home Response Models ------------------------------------------
class HomeResponse(BaseModel):
    name: str
    classes: list[HomeClass]
    
class HomeClass(BaseModel):
    id: int
    name: str
   