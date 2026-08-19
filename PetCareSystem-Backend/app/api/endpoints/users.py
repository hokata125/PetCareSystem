from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.depends import get_current_user
from app.core.tawk import create_tawk_hash
from app.db.session import get_db
from app.models.models import User
from app.schemas.tawks import TawkIdentityResponse
from app.schemas.users import UserChangePassword, UserResponse, UserUpdate
from app.services.users import (
    change_user_password,
    update_user,
    update_user_avatar,
)

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.get("/tawk-identity", response_model=TawkIdentityResponse)
def get_my_tawk_identity(
    current_user: User = Depends(get_current_user),
):
    return TawkIdentityResponse(
        user_id=str(current_user.id),
        hash=create_tawk_hash(current_user.id),
        name=current_user.full_name,
    )


@router.patch("/profile", response_model=UserResponse)
def update_my_profile(
    user_input_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_user(
            db,
            current_user,
            user_input_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.patch("/profile/password", response_model=UserResponse)
def change_my_password(
    password_input_data: UserChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return change_user_password(
            db=db,
            user=current_user,
            password_input_data=password_input_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.patch("/profile/avatar", response_model=UserResponse)
def update_my_avatar(
    avatar_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_user_avatar(
            db,
            current_user,
            avatar_file,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
