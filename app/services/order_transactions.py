from datetime import datetime, timedelta
from urllib.parse import urlencode

from sqlalchemy.orm import Session

from app.core.configs import settings
from app.models.models import (
    Order,
    OrderStatus,
    OrderTransaction,
    PaymentMethod,
    Product,
    TransactionStatus,
    User,
)

PAYMENT_EXPIRE_MINUTES = 10


def get_order_transaction_by_order_id(
    db: Session, order_id: int
) -> OrderTransaction | None:
    return (
        db.query(OrderTransaction).filter(OrderTransaction.order_id == order_id).first()
    )


def create_order_transaction(db: Session, order: Order) -> OrderTransaction:
    if order.payment_method != PaymentMethod.ONLINE:
        raise ValueError("Chỉ tạo giao dịch cho đơn hàng thanh toán online!")

    if order.id is None:
        db.flush()

    if get_order_transaction_by_order_id(db=db, order_id=order.id):
        raise ValueError("Đơn hàng này đã có giao dịch thanh toán!")

    transaction = OrderTransaction(
        order_id=order.id,
        amount=order.total_price,
        status=TransactionStatus.PENDING,
        transaction_code=f"ORDER{order.id}",
        expires_at=datetime.now() + timedelta(minutes=PAYMENT_EXPIRE_MINUTES),
    )

    db.add(transaction)
    return transaction


def generate_order_qr_url(transaction: OrderTransaction) -> str:
    amount = format(transaction.amount, "f").rstrip("0").rstrip(".")
    query_params = urlencode(
        {
            "acc": settings.SEPAY_ACC,
            "bank": settings.SEPAY_BANK,
            "amount": amount,
            "des": transaction.transaction_code,
        }
    )
    return f"{settings.SEPAY_QR_BASE}?{query_params}"


def get_user_order_transaction(
    db: Session, order_id: int, user: User
) -> OrderTransaction:
    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise ValueError("Đơn hàng không tồn tại!")

    if order.user_id != user.id:
        raise ValueError("Bạn không có quyền xem giao dịch của đơn hàng này!")

    transaction = get_order_transaction_by_order_id(
        db=db,
        order_id=order.id,
    )

    if transaction is None:
        raise ValueError("Đơn hàng này không có giao dịch thanh toán online!")

    return transaction


def expire_order_transaction(db: Session, transaction: OrderTransaction) -> None:
    order = db.query(Order).filter(Order.id == transaction.order_id).first()

    if order is None:
        raise ValueError("Đơn hàng của giao dịch không còn tồn tại!")

    if order.order_status != OrderStatus.PENDING:
        raise ValueError(
            "Chỉ có thể xử lý hết hạn thanh toán cho đơn hàng đang chờ xác nhận!"
        )

    product = db.query(Product).filter(Product.id == order.product_id).first()

    if product is not None:
        product.stock_quantity += order.quantity

    order.order_status = OrderStatus.CANCELLED
    order.cancelled_at = datetime.now()
    order.cancelled_by = order.user_id
    transaction.status = TransactionStatus.EXPIRED


def expire_order_payment(db: Session, order_id: int, user: User) -> OrderTransaction:
    transaction = get_user_order_transaction(db=db, order_id=order_id, user=user)

    if transaction.status == TransactionStatus.EXPIRED:
        raise ValueError("Giao dịch đã hết hạn thanh toán!")

    if transaction.status != TransactionStatus.PENDING:
        raise ValueError("Giao dịch không còn ở trạng thái chờ thanh toán!")

    if datetime.now() < transaction.expires_at:
        raise ValueError("Giao dịch vẫn còn thời hạn thanh toán!")

    expire_order_transaction(db=db, transaction=transaction)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return transaction


def get_order_payment(
    db: Session, order_id: int, user: User
) -> tuple[OrderTransaction, str | None]:
    transaction = get_user_order_transaction(
        db=db,
        order_id=order_id,
        user=user,
    )

    qr_url = None

    if (
        transaction.status == TransactionStatus.PENDING
        and datetime.now() < transaction.expires_at
    ):
        qr_url = generate_order_qr_url(transaction)

    return transaction, qr_url


def request_order_payment_confirmation(
    db: Session, order_id: int, user: User
) -> OrderTransaction:
    transaction = get_user_order_transaction(
        db=db,
        order_id=order_id,
        user=user,
    )

    if transaction.status == TransactionStatus.WAITING_CONFIRM:
        raise ValueError("Giao dịch đã được gửi đến admin để chờ xác nhận!")

    if transaction.status != TransactionStatus.PENDING:
        raise ValueError("Giao dịch không còn ở trạng thái chờ thanh toán!")

    if datetime.now() >= transaction.expires_at:
        expire_order_payment(db=db, order_id=order_id, user=user)

        raise ValueError("Giao dịch đã quá hạn thanh toán!")

    transaction.status = TransactionStatus.WAITING_CONFIRM

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return transaction
