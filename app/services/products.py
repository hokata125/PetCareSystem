from typing import Literal

from sqlalchemy.orm import Session

from app.models.models import Product


def get_all_products(
    db: Session,
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
    skip: int = 0,
    limit: int = 10,
) -> list[Product]:
    query = db.query(Product).filter(Product.is_active == True)

    if search_name is not None and search_name.strip():
        query = query.filter(Product.name.contains(search_name.strip()))

    if price_sort == "asc":
        query = query.order_by(Product.price.asc(), Product.id.asc())
    elif price_sort == "desc":
        query = query.order_by(Product.price.desc(), Product.id.asc())
    else:
        query = query.order_by(Product.id.asc())

    return query.offset(skip).limit(limit).all()


def get_product_by_id(
    db: Session,
    product_id: int,
) -> Product | None:
    return (
        db.query(Product)
        .filter(Product.id == product_id, Product.is_active == True)
        .first()
    )
