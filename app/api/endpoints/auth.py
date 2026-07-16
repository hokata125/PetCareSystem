from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.db.session import get_db
from app.schemas.tokens import TokenResponse
from app.schemas.users import UserCreate, UserLogin, UserResponse
from app.services.users import auth_user, create_user


router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_process(
    user_input_data: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_user(db, user_input_data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.post("/login", response_model=TokenResponse)
def login_process(
    user_input_data: UserLogin,
    db: Session = Depends(get_db),
):
    user = auth_user(
        db,
        user_input_data.username,
        user_input_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tài khoản hoặc mật khẩu không chính xác!",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị hạn chế!",
    )

    return TokenResponse(
        access_token=create_access_token(user.id),
    )
