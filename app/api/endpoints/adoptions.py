from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.depends import get_current_user
from app.db.session import get_db
from app.models.models import User, UserRole
from app.schemas.adoptions import AdoptionCreate, AdoptionResponse
from app.services.adoptions import (
    cancel_adoption,
    create_adoption,
    get_adoption_by_id,
    get_user_adoptions,
)

router = APIRouter()


@router.post(
    "",
    response_model=AdoptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_my_adoption(
    adoption_input_data: AdoptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_adoption(
            db=db,
            user=current_user,
            adoption_input_data=adoption_input_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get("", response_model=list[AdoptionResponse])
def get_my_adoptions(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_adoptions(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
    )


@router.get("/{adoption_id}", response_model=AdoptionResponse)
def get_my_adoption_detail(
    adoption_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    adoption = get_adoption_by_id(db, adoption_id)

    if adoption is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn nhận nuôi!",
        )

    if current_user.role != UserRole.ADMIN and adoption.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn nhận nuôi này!",
        )

    return adoption


@router.patch("/{adoption_id}/cancel", response_model=AdoptionResponse)
def cancel_my_adoption(
    adoption_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return cancel_adoption(
            db=db,
            adoption_id=adoption_id,
            user=current_user,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
