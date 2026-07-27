from datetime import datetime

from fastapi import Request
from sqlalchemy.orm import object_session
from sqladmin import ModelView
from wtforms.validators import NumberRange, Optional

from app.db.session import SessionLocal
from app.models.models import Order, OrderStatus, PaymentMethod, Product
from app.schemas.orders import OrderCreate
from app.services.orders import create_order
from app.services.users import get_user_by_id


class OrderView(ModelView, model=Order):
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
    form_include_pk = True
    form_columns = [
        Order.user_id,
        Order.product_id,
        Order.quantity,
        Order.receiver_address,
        Order.payment_method,
        Order.order_status,
    ]
    form_create_rules = [
        "user_id",
        "product_id",
        "quantity",
        "receiver_address",
        "payment_method",
    ]
    form_edit_rules = ["order_status"]
    form_args = {
        "user_id": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Mã khách hàng không hợp lệ!",
                ),
            ]
        },
        "product_id": {
            "validators": [
                NumberRange(
                    min=1,
                    message="Mã sản phẩm không hợp lệ!",
                ),
            ]
        },
        "quantity": {
            "validators": [
                NumberRange(
                    min=1,
                    max=10000,
                    message="Số lượng sản phẩm đặt phải từ 1 - 10000!",
                ),
            ]
        },
        "receiver_address": {
            "validators": [
                Optional(),
            ]
        },
    }

    async def insert_model(
        self,
        request: Request,
        data: dict,
    ) -> Order:
        with SessionLocal() as db:
            user = get_user_by_id(db=db, user_id=data["user_id"])

            if user is None or not user.is_active:
                raise ValueError("Khách hàng không tồn tại hoặc đã bị hạn chế!")

            order_input_data = OrderCreate(
                product_id=data["product_id"],
                quantity=data["quantity"],
                receiver_address=data.get("receiver_address"),
                payment_method=PaymentMethod[data["payment_method"]],
            )

            order = create_order(
                db=db,
                user=user,
                order_input_data=order_input_data,
            )

            db.refresh(order)
            return order

    def change_order_status(
        self,
        data: dict,
        model: Order,
        request: Request,
    ) -> None:
        current_status = model.order_status
        new_status = OrderStatus[data["order_status"]]

        if new_status == current_status:
            return

        allowed_transitions = {
            OrderStatus.PENDING: [
                OrderStatus.CONFIRMED,
                OrderStatus.CANCELLED,
            ],
            OrderStatus.CONFIRMED: [
                OrderStatus.SHIPPING,
                OrderStatus.CANCELLED,
            ],
            OrderStatus.SHIPPING: [
                OrderStatus.COMPLETED,
                OrderStatus.CANCELLED,
            ],
            OrderStatus.COMPLETED: [],
            OrderStatus.CANCELLED: [],
        }

        if new_status not in allowed_transitions[current_status]:
            raise ValueError(
                f"Không thể chuyển trạng thái từ '{current_status}' sang '{new_status}'!"
            )

        data["order_status"] = new_status

        if new_status == OrderStatus.CANCELLED:
            db = object_session(model)

            if db is None:
                raise ValueError("Lỗi cập nhật tồn kho sản phẩm trong cơ sở dữ liệu!")

            product = db.query(Product).filter(Product.id == model.product_id).first()

            if product is None:
                raise ValueError("Sản phẩm trong đơn hàng không còn tồn tại!")

            product.stock_quantity += model.quantity
            admin_id = request.session.get("admin_id")
            data["cancelled_at"] = datetime.now()
            data["cancelled_by"] = admin_id

    async def on_model_change(
        self,
        data: dict,
        model: Order,
        is_created: bool,
        request: Request,
    ) -> None:
        if is_created:
            return

        self.change_order_status(
            data=data,
            model=model,
            request=request,
        )
