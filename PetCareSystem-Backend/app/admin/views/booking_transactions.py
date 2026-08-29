from datetime import datetime

from fastapi import Request
from sqlalchemy.orm import object_session
from sqladmin import ModelView

from app.models.models import (
    Booking,
    BookingStatus,
    BookingTransaction,
    TransactionStatus,
)


class BookingTransactionView(ModelView, model=BookingTransaction):
    can_create = False
    can_delete = False

    column_list = [
        BookingTransaction.id,
        BookingTransaction.booking_id,
        BookingTransaction.amount,
        BookingTransaction.status,
        BookingTransaction.transaction_code,
        BookingTransaction.created_at,
        BookingTransaction.expires_at,
        BookingTransaction.paid_at,
    ]
    column_sortable_list = [
        BookingTransaction.id,
        BookingTransaction.amount,
        BookingTransaction.status,
        BookingTransaction.created_at,
        BookingTransaction.expires_at,
        BookingTransaction.paid_at,
    ]
    form_columns = [
        BookingTransaction.status,
    ]
    form_edit_rules = [
        "status",
    ]

    def change_transaction_status(
        self, data: dict, model: BookingTransaction, request: Request
    ) -> None:
        current_status = model.status
        new_status = TransactionStatus[data["status"]]

        if new_status == current_status:
            return

        allowed_transitions = {
            TransactionStatus.PENDING: [
                TransactionStatus.EXPIRED,
            ],
            TransactionStatus.WAITING_ADMIN_CONFIRM: [
                TransactionStatus.SUCCESS,
                TransactionStatus.FAILED,
            ],
            TransactionStatus.SUCCESS: [],
            TransactionStatus.FAILED: [],
            TransactionStatus.CANCELLED: [],
            TransactionStatus.EXPIRED: [],
        }

        if new_status not in allowed_transitions[current_status]:
            raise ValueError(
                f"Không thể chuyển trạng thái từ '{current_status}' sang '{new_status}'!"
            )

        if (
            new_status == TransactionStatus.EXPIRED
            and datetime.now() < model.expires_at
        ):
            raise ValueError("Giao dịch vẫn còn thời hạn thanh toán!")

        db = object_session(model)

        if db is None:
            raise ValueError("Lỗi cập nhật giao dịch trong cơ sở dữ liệu!")

        booking = db.query(Booking).filter(Booking.id == model.booking_id).first()

        if booking is None:
            raise ValueError("Lịch đặt của giao dịch không còn tồn tại!")

        if booking.booking_status != BookingStatus.PENDING:
            raise ValueError(
                "Chỉ có thể xử lý giao dịch của lịch đặt đang chờ xác nhận!"
            )

        data["status"] = new_status

        if new_status == TransactionStatus.EXPIRED:
            booking.booking_status = BookingStatus.CANCELLED
            booking.cancelled_at = datetime.now()
            booking.cancelled_by = booking.user_id
            return

        if new_status == TransactionStatus.SUCCESS:
            data["paid_at"] = datetime.now()
            booking.booking_status = BookingStatus.CONFIRMED
            return

        booking.booking_status = BookingStatus.CANCELLED
        admin_id = request.session.get("admin_id")
        booking.cancelled_at = datetime.now()
        booking.cancelled_by = admin_id

    async def on_model_change(
        self,
        data: dict,
        model: BookingTransaction,
        is_created: bool,
        request: Request,
    ) -> None:
        self.change_transaction_status(
            data=data,
            model=model,
            request=request,
        )
