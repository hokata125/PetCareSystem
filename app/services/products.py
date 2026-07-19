from typing import Literal

from sqlalchemy.orm import Session

from app.models.models import Product


def get_all_products(
    db: Session,
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
) -> list[Product]:
    query = db.query(Product).filter(Product.is_active == True)

    if search_name is not None and search_name.strip():
        query = query.filter(Product.name.contains(search_name.strip()))

    if price_sort == "asc":
        query = query.order_by(Product.price.asc())
    elif price_sort == "desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.id.asc())

    return query.all()


def get_product_by_id(
    db: Session,
    product_id: int,
) -> Product | None:
    return (
        db.query(Product)
        .filter(Product.id == product_id, Product.is_active == True)
        .first()
    )
