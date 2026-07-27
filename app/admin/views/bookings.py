from datetime import datetime

from fastapi import Request
from sqladmin import ModelView
from wtforms.validators import DataRequired, NumberRange, Optional

from app.db.session import SessionLocal
from app.models.models import Booking, BookingStatus, PaymentMethod
from app.schemas.bookings import BookingCreate
from app.services.bookings import create_booking
from app.services.users import get_user_by_id


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
        Booking.base_price,
        Booking.final_price,
        Booking.payment_method,
        Booking.booking_status,
    ]
    column_searchable_list = [
        Booking.customer_full_name,
        Booking.customer_phone_number,
        Booking.service_name,
        Booking.pet_name,
        Booking.pet_type,
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
    form_edit_rules = [
        "note",
        "booking_status",
    ]
    form_args = {
        "user_id": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Khách hàng không hợp lệ!",
                ),
            ]
        },
        "service_id": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Dịch vụ không hợp lệ!",
                ),
            ]
        },
        "end_at": {
            "validators": [
                Optional(),
            ]
        },
        "pet_name": {
            "validators": [
                DataRequired(
                    message="Tên thú cưng không được để trống!",
                ),
            ]
        },
        "pet_type": {
            "validators": [
                DataRequired(
                    message="Loại thú cưng không được để trống!",
                ),
            ]
        },
        "pet_weight": {
            "validators": [
                NumberRange(
                    min=1,
                    max=50,
                    message="Cân nặng thú cưng phải từ 1 - 50kg!",
                ),
            ]
        },
    }

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
                BookingStatus.IN_PROGRESS,
                BookingStatus.CANCELLED,
            ],
            BookingStatus.IN_PROGRESS: [
                BookingStatus.COMPLETED,
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
