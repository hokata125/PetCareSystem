from datetime import datetime

from sqlalchemy.orm import Session

from app.models.models import Order, OrderStatus, Product, User, UserRole
from app.schemas.orders import OrderCreate
from app.services.products import get_product_by_id


def get_order_by_id(
    db: Session,
    order_id: int,
) -> Order | None:
    return db.query(Order).filter(Order.id == order_id).first()


def get_user_orders(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 10,
) -> list[Order]:
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc(), Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_order(
    db: Session,
    user: User,
    order_input_data: OrderCreate,
) -> Order:
    product = get_product_by_id(db, order_input_data.product_id)

    if product is None:
        raise ValueError("Sản phẩm không tồn tại hoặc đã ngừng bán!")

    if product.stock_quantity < order_input_data.quantity:
        raise ValueError("Số lượng sản phẩm trong kho không đủ!")

    unit_price = product.price
    total_price = round(unit_price * order_input_data.quantity, 2)

    order = Order(
        user_id=user.id,
        product_id=product.id,
        receiver_full_name=user.full_name,
        receiver_phone_number=user.phone_number,
        receiver_address=order_input_data.receiver_address or user.address,
        quantity=order_input_data.quantity,
        unit_price=unit_price,
        total_price=total_price,
        payment_method=order_input_data.payment_method,
    )

    product.stock_quantity -= order_input_data.quantity

    try:
        db.add(order)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return order


def cancel_order(
    db: Session,
    order_id: int,
    user: User,
) -> Order:
    order = get_order_by_id(db, order_id)

    if order is None:
        raise ValueError("Đơn hàng không tồn tại!")

    if user.role != UserRole.ADMIN and order.user_id != user.id:
        raise ValueError("Bạn không có quyền hủy đơn hàng này!")

    if order.order_status != OrderStatus.PENDING:
        raise ValueError("Chỉ có thể hủy đơn hàng đang chờ xác nhận!")

    product = db.query(Product).filter(Product.id == order.product_id).first()

    if product is None:
        raise ValueError("Sản phẩm của đơn hàng không còn tồn tại!")

    product.stock_quantity += order.quantity
    order.order_status = OrderStatus.CANCELLED
    order.cancelled_at = datetime.now()
    order.cancelled_by = user.id

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return order
