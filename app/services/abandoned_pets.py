from typing import Literal

from sqlalchemy.orm import Session

from app.models.models import AbandonedPet


def get_all_abandoned_pets(
    db: Session,
    search_name: str | None = None,
    pet_type: str | None = None,
    sort_by: Literal["age", "weight"] | None = None,
    sort_order: Literal["asc", "desc"] = "asc",
    skip: int = 0,
    limit: int = 10,
) -> list[AbandonedPet]:
    query = db.query(AbandonedPet).filter(AbandonedPet.is_active == True)

    if search_name is not None and search_name.strip():
        query = query.filter(AbandonedPet.name.contains(search_name.strip()))

    if pet_type is not None and pet_type.strip():
        query = query.filter(AbandonedPet.pet_type.contains(pet_type.strip()))

    if sort_by is None:
        query = query.order_by(AbandonedPet.id.asc())
    else:
        if sort_by == "age":
            sort_column = AbandonedPet.age
        elif sort_by == "weight":
            sort_column = AbandonedPet.weight
        else:
            raise ValueError("Chỉ được sắp xếp theo 'tuổi' hoặc 'cân nặng'.")

        if sort_order == "desc":
            query = query.order_by(sort_column.desc(), AbandonedPet.id.asc())
        else:
            query = query.order_by(sort_column.asc(), AbandonedPet.id.asc())

    return query.offset(skip).limit(limit).all()


def get_abandoned_pet_by_id(
    db: Session,
    abandoned_pet_id: int,
) -> AbandonedPet | None:
    return (
        db.query(AbandonedPet)
        .filter(AbandonedPet.id == abandoned_pet_id, AbandonedPet.is_active == True)
        .first()
    )
