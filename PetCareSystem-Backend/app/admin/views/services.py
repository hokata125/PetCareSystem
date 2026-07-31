from fastapi import Request
from sqladmin import ModelView
from wtforms.validators import DataRequired, NumberRange

from app.models.models import Service


class ServiceView(ModelView, model=Service):
    can_delete = False

    column_list = [
        Service.id,
        Service.name,
        Service.service_type,
        Service.description,
        Service.price,
        Service.is_active,
    ]
    column_searchable_list = [Service.name]
    column_sortable_list = [
        Service.id,
        Service.name,
        Service.service_type,
        Service.price,
    ]
    column_details_exclude_list = [Service.bookings]
    form_columns = [
        Service.name,
        Service.description,
        Service.price,
        Service.service_type,
        Service.image,
        Service.is_active,
    ]
    form_args = {
        "name": {
            "validators": [
                DataRequired(
                    message="Tên dịch vụ không được để trống!",
                )
            ]
        },
        "price": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Giá dịch vụ phải lớn hơn 0!",
                )
            ]
        },
    }

    async def on_model_change(
        self,
        data: dict,
        model: Service,
        is_created: bool,
        request: Request,
    ) -> None:
        data["name"] = data["name"].strip()
