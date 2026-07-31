from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.products import ProductResponse
from app.services.products import get_all_products, get_product_by_id

router = APIRouter()


@router.get("", response_model=list[ProductResponse])
def get_products(
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_all_products(
        db=db,
        search_name=search_name,
        price_sort=price_sort,
        skip=skip,
        limit=limit,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_detail(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = get_product_by_id(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm!",
        )

    return product
