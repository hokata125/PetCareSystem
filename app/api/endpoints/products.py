from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.products import ProductResponse
from app.services.products import get_all_products, get_product_by_id

router = APIRouter()


@router.get("", response_model=list[ProductResponse])
def get_products(
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
    db: Session = Depends(get_db),
):
    return get_all_products(
        db,
        search_name,
        price_sort,
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
