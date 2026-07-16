from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.depends import get_current_user
from app.db.session import get_db
from app.models.models import User
from app.schemas.users import UserResponse, UserUpdate
from app.services.users import update_user


router = APIRouter()


@router.get("/profile", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


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
