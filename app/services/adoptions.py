from datetime import datetime

from sqlalchemy.orm import Session

from app.models.models import (
    AbandonedPet,
    Adoption,
    AdoptionStatus,
    PetStatus,
    User,
    UserRole,
)
from app.schemas.adoptions import AdoptionCreate
from app.services.abandoned_pets import get_abandoned_pet_by_id


def get_adoption_by_id(
    db: Session,
    adoption_id: int,
) -> Adoption | None:
    return db.query(Adoption).filter(Adoption.id == adoption_id).first()


def get_user_adoptions(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 10,
) -> list[Adoption]:
    return (
        db.query(Adoption)
        .filter(Adoption.user_id == user_id)
        .order_by(Adoption.created_at.desc(), Adoption.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_adoption(
    db: Session,
    user: User,
    adoption_input_data: AdoptionCreate,
) -> Adoption:
    abandoned_pet = get_abandoned_pet_by_id(db, adoption_input_data.abandoned_pet_id)

    if abandoned_pet is None:
        raise ValueError("Thú cưng không tồn tại hoặc đã ngừng cho nhận nuôi!")

    adoption = Adoption(
        user_id=user.id,
        abandoned_pet_id=abandoned_pet.id,
        owner_full_name=user.full_name,
        owner_phone_number=user.phone_number,
        owner_address=user.address,
        pet_name=abandoned_pet.name,
        pet_type=abandoned_pet.pet_type,
        pet_age=abandoned_pet.age,
        pet_weight=abandoned_pet.weight,
        pet_health_status=abandoned_pet.health_status,
        note=adoption_input_data.note,
    )

    abandoned_pet.pet_status = PetStatus.RESERVED

    try:
        db.add(adoption)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return adoption


def cancel_adoption(
    db: Session,
    adoption_id: int,
    user: User,
) -> Adoption:
    adoption = get_adoption_by_id(db, adoption_id)

    if adoption is None:
        raise ValueError("Đơn nhận nuôi không tồn tại!")

    if user.role != UserRole.ADMIN and adoption.user_id != user.id:
        raise ValueError("Bạn không có quyền hủy đơn nhận nuôi này!")

    if adoption.adoption_status != AdoptionStatus.PENDING:
        raise ValueError("Chỉ có thể hủy đơn nhận nuôi đang chờ duyệt!")

    abandoned_pet = (
        db.query(AbandonedPet)
        .filter(AbandonedPet.id == adoption.abandoned_pet_id)
        .first()
    )

    if abandoned_pet is None:
        raise ValueError("Thú cưng của đơn nhận nuôi không còn tồn tại!")

    abandoned_pet.pet_status = PetStatus.AVAILABLE
    adoption.adoption_status = AdoptionStatus.CANCELLED
    adoption.cancelled_at = datetime.now()
    adoption.cancelled_by = user.id

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return adoption
