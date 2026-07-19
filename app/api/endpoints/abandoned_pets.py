from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.abandoned_pets import AbandonedPetResponse
from app.services.abandoned_pets import (
    get_abandoned_pet_by_id,
    get_all_abandoned_pets,
)

router = APIRouter()


@router.get("", response_model=list[AbandonedPetResponse])
def get_abandoned_pets(
    search_name: str | None = None,
    pet_type: str | None = None,
    sort_by: Literal["age", "weight"] | None = None,
    sort_order: Literal["asc", "desc"] = "asc",
    db: Session = Depends(get_db),
):
    return get_all_abandoned_pets(
        db,
        search_name,
        pet_type,
        sort_by,
        sort_order,
    )


@router.get("/{abandoned_pet_id}", response_model=AbandonedPetResponse)
def get_abandoned_pet_detail(
    abandoned_pet_id: int,
    db: Session = Depends(get_db),
):
    abandoned_pet = get_abandoned_pet_by_id(db, abandoned_pet_id)

    if abandoned_pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thú cưng!",
        )

    return abandoned_pet
