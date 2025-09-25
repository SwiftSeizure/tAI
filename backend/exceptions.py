from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from backend.models import ClientErrorResponse


class EntityNotFoundException(Exception):
    """Exception for a non-existent entity."""
    def __init__(self, entity_name: str, entity_id: str):
        self.status_code = 404
        self.error = f"entity_not_found"
        self.message = f"Unable to find {entity_name} with id={entity_id}"
        
    def response(self) -> Response:
        """HTTP response when a non-existent entity is requested."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )
        
class UploadNotFoundException(Exception):
    """Exception for a non-existent upload."""
    def __init__(self, day_id: int, filename: str):
        self.status_code = 404
        self.error = f"upload_not_found"
        self.message = f"Unable to find upload with name={filename} in day with id={day_id}"
        
    def response(self) -> Response:
        """HTTP response when a non-existent upload is requested."""
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
    
class InvalidClassCodeException(Exception):
    """Exception for a non-existent entity."""
    def __init__(self):
        self.status_code = 404
        self.error = f"invalid_class_code"
        self.message = f""
        
    def response(self) -> Response:
        """HTTP response when a non-existent entity is requested."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )
        
class UnauthorizedException(Exception):
    """Exception for unauthorized access."""
    def __init__(self, action: str):
        self.status_code = 401
        self.error = f"unauthorized"
        self.message = f"You do not have permission to {action}."
        
    def response(self) -> Response:
        """HTTP response when unauthorized access is attempted."""
        return JSONResponse(
            status_code=self.status_code,
            content=ClientErrorResponse(error=self.error, message=self.message).model_dump(),
        )