from fastapi import Request
from sqladmin import ModelView
from wtforms.validators import DataRequired, NumberRange

from app.models.models import (
    AbandonedPet,
    Adoption,
    Booking,
    Order,
    Product,
    Service,
    User,
)


class UserView(ModelView, model=User):
    can_create = False
    can_edit = False
    can_delete = False
    can_view_details = True

    column_list = [
        User.id,
        User.username,
        User.full_name,
        User.gender,
        User.email,
        User.phone_number,
        User.role,
        User.is_active,
    ]
    column_searchable_list = [
        User.username,
        User.full_name,
        User.email,
        User.phone_number,
    ]
    column_sortable_list = [
        User.id,
        User.username,
        User.full_name,
        User.role,
        User.is_active,
    ]
    column_details_exclude_list = [
        User.password,
        User.bookings,
        User.adoptions,
        User.orders,
    ]


class ProductView(ModelView, model=Product):
    can_create = True
    can_edit = True
    can_delete = False
    can_view_details = True

    column_list = [
        Product.id,
        Product.name,
        Product.description,
        Product.price,
        Product.stock_quantity,
        Product.is_active,
    ]
    column_searchable_list = [Product.name]
    column_sortable_list = [
        Product.id,
        Product.name,
        Product.price,
        Product.stock_quantity,
    ]
    column_details_exclude_list = [Product.orders]
    form_columns = [
        Product.name,
        Product.description,
        Product.price,
        Product.stock_quantity,
        Product.image,
        Product.is_active,
    ]
    form_args = {
        "name": {
            "validators": [
                DataRequired(
                    message="Tên sản phẩm không được để trống!",
                )
            ]
        },
        "price": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Giá sản phẩm phải lớn hơn 0!",
                )
            ]
        },
        "stock_quantity": {
            "validators": [
                NumberRange(
                    min=0,
                    max=10000,
                    message="Số lượng tồn kho phải từ 0 - 10000!",
                )
            ]
        },
    }

    async def on_model_change(
        self,
        data: dict,
        model: Product,
        is_created: bool,
        request: Request,
    ) -> None:
        data["name"] = data["name"].strip()


class ServiceView(ModelView, model=Service):
    can_create = True
    can_edit = True
    can_delete = False
    can_view_details = True

    column_list = [
        Service.id,
        Service.name,
        Service.service_type,
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


class AbandonedPetView(ModelView, model=AbandonedPet):
    can_create = True
    can_edit = True
    can_delete = False
    can_view_details = True

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
        AbandonedPet.pet_status,
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


class BookingView(ModelView, model=Booking):
    can_create = False
    can_edit = True
    can_delete = False
    can_view_details = True

    column_list = [
        Booking.id,
        Booking.user_id,
        Booking.service_id,
        Booking.start_at,
        Booking.end_at,
        Booking.pet_name,
        Booking.pet_type,
        Booking.final_price,
        Booking.booking_status,
    ]
    column_sortable_list = [
        Booking.id,
        Booking.start_at,
        Booking.final_price,
        Booking.booking_status,
    ]
    form_columns = [Booking.booking_status]


class OrderView(ModelView, model=Order):
    can_create = False
    can_edit = True
    can_delete = False
    can_view_details = True

    column_list = [
        Order.id,
        Order.user_id,
        Order.product_id,
        Order.quantity,
        Order.unit_price,
        Order.total_price,
        Order.payment_method,
        Order.order_status,
    ]
    column_sortable_list = [
        Order.id,
        Order.quantity,
        Order.total_price,
        Order.order_status,
    ]
    form_columns = [Order.order_status]


class AdoptionView(ModelView, model=Adoption):
    can_create = False
    can_edit = True
    can_delete = False
    can_view_details = True

    column_list = [
        Adoption.id,
        Adoption.user_id,
        Adoption.abandoned_pet_id,
        Adoption.adoption_status,
    ]
    column_sortable_list = [
        Adoption.id,
        Adoption.adoption_status,
    ]
    form_columns = [Adoption.adoption_status]
