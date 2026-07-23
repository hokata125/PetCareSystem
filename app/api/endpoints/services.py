from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.services import ServiceResponse
from app.services.services import get_all_services, get_service_by_id

router = APIRouter()


@router.get("", response_model=list[ServiceResponse])
def get_services(
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_all_services(
        db=db,
        search_name=search_name,
        price_sort=price_sort,
        skip=skip,
        limit=limit,
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
