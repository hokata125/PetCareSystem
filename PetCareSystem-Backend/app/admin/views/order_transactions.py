from datetime import datetime

from fastapi import Request
from sqlalchemy.orm import object_session
from sqladmin import ModelView

from app.models.models import (
    Order,
    OrderStatus,
    OrderTransaction,
    Product,
    TransactionStatus,
)


class OrderTransactionView(ModelView, model=OrderTransaction):
    can_create = False
    can_delete = False

    column_list = [
        OrderTransaction.id,
        OrderTransaction.order_id,
        OrderTransaction.amount,
        OrderTransaction.status,
        OrderTransaction.transaction_code,
        OrderTransaction.created_at,
        OrderTransaction.expires_at,
        OrderTransaction.paid_at,
    ]
    column_sortable_list = [
        OrderTransaction.id,
        OrderTransaction.amount,
        OrderTransaction.status,
        OrderTransaction.created_at,
        OrderTransaction.expires_at,
        OrderTransaction.paid_at,
    ]
    form_columns = [
        OrderTransaction.status,
    ]
    form_edit_rules = [
        "status",
    ]

    def change_transaction_status(
        self, data: dict, model: OrderTransaction, request: Request
    ) -> None:
        current_status = model.status
        new_status = TransactionStatus[data["status"]]

        if new_status == current_status:
            return

        if current_status != TransactionStatus.WAITING_CONFIRM or new_status not in {
            TransactionStatus.SUCCESS,
            TransactionStatus.FAILED,
        }:
            raise ValueError(
                f"Không thể chuyển trạng thái từ '{current_status}' sang '{new_status}'!"
            )

        db = object_session(model)

        if db is None:
            raise ValueError("Lỗi cập nhật giao dịch trong cơ sở dữ liệu!")

        order = db.query(Order).filter(Order.id == model.order_id).first()

        if order is None:
            raise ValueError("Đơn hàng của giao dịch không còn tồn tại!")

        if order.order_status != OrderStatus.PENDING:
            raise ValueError(
                "Chỉ có thể xác nhận giao dịch của đơn hàng đang chờ xác nhận!"
            )

        data["status"] = new_status

        if new_status == TransactionStatus.SUCCESS:
            data["paid_at"] = datetime.now()
            order.order_status = OrderStatus.CONFIRMED
            return

        product = db.query(Product).filter(Product.id == order.product_id).first()

        if product is not None:
            product.stock_quantity += order.quantity

        order.order_status = OrderStatus.CANCELLED
        admin_id = request.session.get("admin_id")
        order.cancelled_at = datetime.now()
        order.cancelled_by = admin_id

    async def on_model_change(
        self,
        data: dict,
        model: OrderTransaction,
        is_created: bool,
        request: Request,
    ) -> None:
        self.change_transaction_status(
            data=data,
            model=model,
            request=request,
        )
