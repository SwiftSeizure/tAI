from fastapi import APIRouter
from fastapi.responses import FileResponse
import backend.path_fetch as path_fetch

router=APIRouter(prefix="/material", tags=["material"])

@router.get("/{day_id}/{filename}")
def get_file(day_id: int, filename: str):
    path = path_fetch.get_safe_path("material", day_id, filename)
    return FileResponse(path=path, filename=filename)