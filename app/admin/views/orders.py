from sqladmin import ModelView

from app.models.models import Order


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
