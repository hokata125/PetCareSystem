from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.services import ServiceResponse
from app.services.services import get_all_services, get_service_by_id

router = APIRouter()


@router.get("", response_model=list[ServiceResponse])
def get_services(
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
    db: Session = Depends(get_db),
):
    return get_all_services(
        db,
        search_name,
        price_sort,
    )


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service_detail(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = get_service_by_id(db, service_id)

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy dịch vụ!",
        )

    return service
