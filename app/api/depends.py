import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.models import User, UserRole
from app.services.users import get_user_by_id


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    auth_credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn!",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if auth_credentials is None or auth_credentials.scheme.lower() != "bearer":
        raise credentials_exception

    try:
        payload = decode_access_token(auth_credentials.credentials)
        subject = payload.get("sub")

        if subject is None:
            raise credentials_exception
        user_id = int(subject)

    except (jwt.InvalidTokenError, TypeError, ValueError):
        raise credentials_exception

    user = get_user_by_id(db, user_id)

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị hạn chế!",
        )

    return user


def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn cần có quyền ADMIN để thực hiện hành động này!",
        )

    return current_user


def require_staff_or_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    allowed_roles = {UserRole.ADMIN, UserRole.STAFF}

    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn cần có quyền STAFF hoặc ADMIN để thực hiện hành động này!",
        )

    return current_user
