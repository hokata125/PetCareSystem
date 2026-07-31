from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
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
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_all_abandoned_pets(
        db=db,
        search_name=search_name,
        pet_type=pet_type,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit,
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
