from typing import Literal

from sqlalchemy.orm import Session

from app.models.models import Service


def get_all_services(
    db: Session,
    search_name: str | None = None,
    price_sort: Literal["asc", "desc"] | None = None,
) -> list[Service]:
    query = db.query(Service).filter(Service.is_active == True)

    if search_name is not None and search_name.strip():
        query = query.filter(Service.name.contains(search_name.strip()))

    if price_sort == "asc":
        query = query.order_by(Service.price.asc())
    elif price_sort == "desc":
        query = query.order_by(Service.price.desc())
    else:
        query = query.order_by(Service.id.asc())

    return query.all()


def get_service_by_id(
    db: Session,
    service_id: int,
) -> Service | None:
    return (
        db.query(Service)
        .filter(Service.id == service_id, Service.is_active == True)
        .first()
    )
