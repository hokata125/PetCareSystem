from fastapi import Request
from sqladmin import ModelView
from wtforms.validators import DataRequired, NumberRange

from app.models.models import AbandonedPet, PetStatus


class AbandonedPetView(ModelView, model=AbandonedPet):
    can_delete = False

    async def check_can_edit(
        self,
        request: Request,
        model: AbandonedPet | None,
    ) -> bool:
        return model is not None and model.pet_status == PetStatus.AVAILABLE

    column_list = [
        AbandonedPet.id,
        AbandonedPet.name,
        AbandonedPet.pet_type,
        AbandonedPet.age,
        AbandonedPet.weight,
        AbandonedPet.pet_status,
        AbandonedPet.is_active,
    ]
    column_searchable_list = [
        AbandonedPet.name,
        AbandonedPet.pet_type,
    ]
    column_sortable_list = [
        AbandonedPet.id,
        AbandonedPet.name,
        AbandonedPet.pet_type,
        AbandonedPet.age,
        AbandonedPet.weight,
        AbandonedPet.pet_status,
    ]
    column_details_exclude_list = [AbandonedPet.adoptions]
    form_columns = [
        AbandonedPet.name,
        AbandonedPet.pet_type,
        AbandonedPet.age,
        AbandonedPet.weight,
        AbandonedPet.health_status,
        AbandonedPet.image,
        AbandonedPet.is_active,
    ]
    form_args = {
        "name": {
            "validators": [
                DataRequired(
                    message="Tên thú cưng không được để trống!",
                )
            ]
        },
        "pet_type": {
            "validators": [
                DataRequired(
                    message="Loại thú cưng không được để trống!",
                )
            ]
        },
        "health_status": {
            "validators": [
                DataRequired(
                    message="Tình trạng sức khỏe không được để trống!",
                )
            ]
        },
        "age": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Tuổi thú cưng phải lớn hơn 0 (tháng)!",
                )
            ]
        },
        "weight": {
            "validators": [
                NumberRange(
                    min=1,
                    max=100,
                    message="Cân nặng thú cưng phải từ 1 - 100kg!",
                )
            ]
        },
    }

    async def on_model_change(
        self,
        data: dict,
        model: AbandonedPet,
        is_created: bool,
        request: Request,
    ) -> None:
        data["name"] = data["name"].strip()
        data["pet_type"] = data["pet_type"].strip()
        data["health_status"] = data["health_status"].strip()
