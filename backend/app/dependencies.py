from .database import get_db
from fastapi import Depends, HTTPException, status
from .auth import decode_access_token
from . import models
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordBearer

# Define OAuth2 scheme (tokenUrl is not used in tests but required)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Retrieve current user from JWT token.

    The token is expected to be provided via the ``Authorization`` header as
    ``Bearer <token>``. FastAPI's ``OAuth2PasswordBearer`` dependency extracts the
    token string for us, handling the ``Bearer`` prefix automatically.
    """
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
