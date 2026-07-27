from datetime import datetime

from fastapi import Request
from sqladmin import ModelView
from wtforms.validators import DataRequired, NumberRange

from app.models.models import (
    AbandonedPet,
    Adoption,
    Booking,
    BookingStatus,
    Order,
    PaymentMethod,
    Product,
    Service,
    User,
)
from app.db.session import SessionLocal
from app.schemas.bookings import BookingCreate
from app.services.bookings import create_booking
from app.services.users import get_user_by_id


class UserView(ModelView, model=User):
    can_create = False
    can_edit = False
    can_delete = False

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
    can_delete = False

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


class AbandonedPetView(ModelView, model=AbandonedPet):
    can_delete = False

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


class BookingView(ModelView, model=Booking):
    can_delete = False

    column_list = [
        Booking.id,
        Booking.user_id,
        Booking.customer_full_name,
        Booking.customer_phone_number,
        Booking.customer_address,
        Booking.service_id,
        Booking.service_name,
        Booking.pet_name,
        Booking.pet_type,
        Booking.pet_weight,
        Booking.note,
        Booking.start_at,
        Booking.end_at,
        Booking.final_price,
        Booking.payment_method,
        Booking.booking_status,
    ]
    column_sortable_list = [
        Booking.id,
        Booking.start_at,
        Booking.final_price,
        Booking.booking_status,
    ]
    form_include_pk = True
    form_columns = [
        Booking.user_id,
        Booking.service_id,
        Booking.start_at,
        Booking.end_at,
        Booking.pet_name,
        Booking.pet_type,
        Booking.pet_weight,
        Booking.note,
        Booking.payment_method,
        Booking.booking_status,
    ]
    form_create_rules = [
        "user_id",
        "service_id",
        "start_at",
        "end_at",
        "pet_name",
        "pet_type",
        "pet_weight",
        "note",
        "payment_method",
    ]
    form_edit_rules = ["booking_status"]

    async def insert_model(
        self,
        request: Request,
        data: dict,
    ) -> Booking:
        with SessionLocal() as db:
            user = get_user_by_id(db=db, user_id=data["user_id"])

            if user is None or not user.is_active:
                raise ValueError("Khách hàng không tồn tại hoặc đã bị hạn chế!")

            booking_input_data = BookingCreate(
                service_id=data["service_id"],
                start_at=data["start_at"],
                end_at=data.get("end_at"),
                pet_name=data["pet_name"],
                pet_type=data["pet_type"],
                pet_weight=data["pet_weight"],
                note=data.get("note"),
                payment_method=PaymentMethod[data["payment_method"]],
            )

            booking = create_booking(
                db=db,
                user=user,
                booking_input_data=booking_input_data,
            )

            db.refresh(booking)
            return booking

    def change_booking_status(
        self, data: dict, model: Booking, request: Request
    ) -> None:
        current_status = model.booking_status
        new_status = BookingStatus[data["booking_status"]]

        if new_status == current_status:
            return

        allowed_transitions = {
            BookingStatus.PENDING: [
                BookingStatus.CONFIRMED,
                BookingStatus.CANCELLED,
            ],
            BookingStatus.CONFIRMED: [
                BookingStatus.COMPLETED,
                BookingStatus.CANCELLED,
            ],
            BookingStatus.COMPLETED: [],
            BookingStatus.CANCELLED: [],
        }

        if new_status not in allowed_transitions[current_status]:
            raise ValueError(
                f"Không thể chuyển trạng thái từ '{current_status}' sang '{new_status}'!"
            )

        data["booking_status"] = new_status

        if new_status == BookingStatus.CANCELLED:
            admin_id = request.session.get("admin_id")
            data["cancelled_at"] = datetime.now()
            data["cancelled_by"] = admin_id

    async def on_model_change(
        self,
        data: dict,
        model: Booking,
        is_created: bool,
        request: Request,
    ) -> None:
        if is_created:
            return

        self.change_booking_status(
            data=data,
            model=model,
            request=request,
        )


class OrderView(ModelView, model=Order):
    can_create = False
    can_delete = False

    column_list = [
        Order.id,
        Order.user_id,
        Order.receiver_full_name,
        Order.receiver_phone_number,
        Order.receiver_address,
        Order.product_id,
        Order.product_name,
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
    form_columns = [Adoption.adoption_status]
