from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin.auth import verify_id_token

ACTIVE = True

# Bearer scheme setup
bearer_scheme = HTTPBearer(auto_error=False)

def get_firebase_user_from_token(
    token: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)]
) -> dict | None:
    """Uses bearer token to identify firebase user id
    Args:
        token : the bearer token. Can be None as we set auto_error to False
    Returns:
        dict: the firebase user on success
    Raises:
        HTTPException 401 if user does not exist or token is invalid
    """
    if not ACTIVE:
        return {"uid": "test-user"}
    
    try:
        if not token:
            raise ValueError("No token")
        user = verify_id_token(token.credentials)
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not logged in or Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )