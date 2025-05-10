from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from backend.models import ClientErrorResponse


class EntityNotFoundException(Exception):
    """Exception for a non-existent entity."""
    def __init__(self, entity_name: str, entity_id: int):
        self.status_code = 404
        self.error = f"entity_not_found"
        self.message = f"Unable to find {entity_name} with id={entity_id}"
        
    def response(self) -> Response:
        """HTTP response when a non-existent entity is requested."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )
        
class FileNotFoundException(Exception):
    """Exception for a non-existent entity."""
    def __init__(self, filename: str):
        self.status_code = 404
        self.error = f"entity_not_found"
        self.message = f"Unable to find file with filename={filename}"
        
    def response(self) -> Response:
        """HTTP response when a non-existent entity is requested."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )
        
class DuplicateNameException(Exception):
    """Exception for a non-existent entity."""
    def __init__(self, entity_type: str, entity_name: str):
        self.status_code = 404
        self.error = f"duplicate_name"
        self.message = f"A(n) {entity_type} with name={entity_name} already exists."
        
    def response(self) -> Response:
        """HTTP response when a non-existent entity is requested."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )
        
class HTTPException(Exception):
    """Exception for a non-existent entity."""
    def __init__(self, status_code: int, error: str, message: str):
        self.status_code = status_code
        self.error = error
        self.message = message
        
    def response(self) -> Response:
        """HTTP response when a non-existent entity is requested."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )