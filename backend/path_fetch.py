from pathlib import Path
from backend.exceptions import FileNotFoundException

# Use __file__ to make path resolution relative to this file
BASE_DIR = Path(__file__).parent.parent / "uploads"
ALLOWED_EXTENSIONS = {'.pdf', '.txt', '.doc', '.docx'}

def get_safe_path(file_type: str, day_id: int, filename: str) -> Path:
    
    # Basic input validation
    if not filename or '..' in filename:
        raise FileNotFoundException(filename)
    
    # Check file extension
    if Path(filename).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise FileNotFoundException(filename)

    # Construct and validate path
    try:
        target_path = BASE_DIR / file_type / str(day_id) / filename
        
        resolved_path = target_path.resolve()

        # Ensure file is within BASE_DIR and exists
        if not resolved_path.is_file():
            raise FileNotFoundException(filename)
            
        if not resolved_path.is_relative_to(BASE_DIR):
            raise FileNotFoundException(filename)
            
        return resolved_path
    except Exception as e:
        raise FileNotFoundException(filename)