import secrets
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from ..config import settings

def generate_verification_token() -> str:
    return secrets.token_urlsafe(32)

def verify_verification_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except Exception:
        return None