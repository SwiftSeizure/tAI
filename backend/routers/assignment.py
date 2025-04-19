from fastapi import APIRouter
from fastapi.responses import FileResponse
import backend.path_fetch as path_fetch

router=APIRouter(prefix="/assignment", tags=["assignment"])

@router.get("/{day_id}/{filename}")
def get_file(day_id: int, filename: str):
    # Debug logging
    print(f"Looking for file: {filename} in day: {day_id}")
    path = path_fetch.get_safe_path("assignment", day_id, filename)
    print(f"Resolved path: {path}")
    return FileResponse(path=path, filename=filename)