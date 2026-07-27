from datetime import datetime

from fastapi import Request
from sqlalchemy.orm import object_session
from sqladmin import ModelView
from wtforms.validators import NumberRange

from app.db.session import SessionLocal
from app.models.models import (
    AbandonedPet,
    Adoption,
    AdoptionStatus,
    PetStatus,
)
from app.schemas.adoptions import AdoptionCreate
from app.services.adoptions import create_adoption
from app.services.users import get_user_by_id


class AdoptionView(ModelView, model=Adoption):
    can_delete = False

    column_list = [
        Adoption.id,
        Adoption.user_id,
        Adoption.owner_full_name,
        Adoption.owner_phone_number,
        Adoption.owner_address,
        Adoption.abandoned_pet_id,
        Adoption.pet_name,
        Adoption.pet_type,
        Adoption.pet_age,
        Adoption.pet_weight,
        Adoption.pet_health_status,
        Adoption.adoption_status,
    ]
    column_sortable_list = [
        Adoption.id,
        Adoption.adoption_status,
    ]
    form_include_pk = True
    form_columns = [
        Adoption.user_id,
        Adoption.abandoned_pet_id,
        Adoption.adoption_status,
    ]
    form_create_rules = [
        "user_id",
        "abandoned_pet_id",
    ]
    form_edit_rules = ["adoption_status"]
    form_args = {
        "user_id": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Mã khách hàng không hợp lệ!",
                ),
            ]
        },
        "abandoned_pet_id": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Mã thú cưng không hợp lệ!",
                ),
            ]
        },
    }

    async def insert_model(
        self,
        request: Request,
        data: dict,
    ) -> Adoption:
        with SessionLocal() as db:
            user = get_user_by_id(db=db, user_id=data["user_id"])

            if user is None or not user.is_active:
                raise ValueError("Khách hàng không tồn tại hoặc đã bị hạn chế!")

            adoption_input_data = AdoptionCreate(
                abandoned_pet_id=data["abandoned_pet_id"],
            )

            adoption = create_adoption(
                db=db,
                user=user,
                adoption_input_data=adoption_input_data,
            )

            db.refresh(adoption)
            return adoption

    def change_adoption_status(
        self,
        data: dict,
        model: Adoption,
        request: Request,
    ) -> None:
        current_status = model.adoption_status
        new_status = AdoptionStatus[data["adoption_status"]]

        if new_status == current_status:
            return

        allowed_transitions = {
            AdoptionStatus.PENDING: [
                AdoptionStatus.APPROVED,
                AdoptionStatus.REJECTED,
                AdoptionStatus.CANCELLED,
            ],
            AdoptionStatus.APPROVED: [
                AdoptionStatus.WAITING_OWNER,
            ],
            AdoptionStatus.WAITING_OWNER: [
                AdoptionStatus.COMPLETED,
                AdoptionStatus.CANCELLED,
            ],
            AdoptionStatus.COMPLETED: [],
            AdoptionStatus.REJECTED: [],
            AdoptionStatus.CANCELLED: [],
        }

        if new_status not in allowed_transitions[current_status]:
            raise ValueError(
                f"Không thể chuyển trạng thái từ '{current_status}' sang '{new_status}'!"
            )

        data["adoption_status"] = new_status

        if new_status in [
            AdoptionStatus.REJECTED,
            AdoptionStatus.CANCELLED,
            AdoptionStatus.COMPLETED,
        ]:
            db = object_session(model)

            if db is None:
                raise ValueError(
                    "Lỗi cập nhật trạng thái thú cưng trong cơ sở dữ liệu!"
                )

            abandoned_pet = (
                db.query(AbandonedPet)
                .filter(AbandonedPet.id == model.abandoned_pet_id)
                .first()
            )

            if abandoned_pet is None:
                raise ValueError("Thú cưng trong đơn nhận nuôi không còn tồn tại!")

            if new_status == AdoptionStatus.COMPLETED:
                abandoned_pet.pet_status = PetStatus.ADOPTED
            else:
                abandoned_pet.pet_status = PetStatus.AVAILABLE

        if new_status == AdoptionStatus.CANCELLED:
            admin_id = request.session.get("admin_id")
            data["cancelled_at"] = datetime.now()
            data["cancelled_by"] = admin_id

    async def on_model_change(
        self,
        data: dict,
        model: Adoption,
        is_created: bool,
        request: Request,
    ) -> None:
        if is_created:
            return

        self.change_adoption_status(
            data=data,
            model=model,
            request=request,
        )
