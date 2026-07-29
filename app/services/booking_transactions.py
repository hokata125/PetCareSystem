from datetime import datetime, timedelta
from urllib.parse import urlencode

from sqlalchemy.orm import Session

from app.core.configs import settings
from app.models.models import (
    Booking,
    BookingStatus,
    BookingTransaction,
    PaymentMethod,
    TransactionStatus,
    User,
)

PAYMENT_EXPIRE_MINUTES = 10


def get_booking_transaction_by_booking_id(
    db: Session, booking_id: int
) -> BookingTransaction | None:
    return (
        db.query(BookingTransaction)
        .filter(BookingTransaction.booking_id == booking_id)
        .first()
    )


def create_booking_transaction(db: Session, booking: Booking) -> BookingTransaction:
    if booking.payment_method != PaymentMethod.ONLINE:
        raise ValueError("Chỉ tạo giao dịch cho lịch đặt thanh toán online!")

    if booking.id is None:
        db.flush()

    if get_booking_transaction_by_booking_id(db=db, booking_id=booking.id):
        raise ValueError("Lịch đặt này đã có giao dịch thanh toán!")

    transaction = BookingTransaction(
        booking_id=booking.id,
        amount=booking.final_price,
        status=TransactionStatus.PENDING,
        transaction_code=f"BOOKING{booking.id}",
        expires_at=datetime.now() + timedelta(minutes=PAYMENT_EXPIRE_MINUTES),
    )

    db.add(transaction)
    return transaction


def generate_booking_qr_url(transaction: BookingTransaction) -> str:
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


def get_user_booking_transaction(
    db: Session, booking_id: int, user: User
) -> BookingTransaction:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if booking is None:
        raise ValueError("Lịch đặt không tồn tại!")

    if booking.user_id != user.id:
        raise ValueError("Bạn không có quyền xem giao dịch của lịch đặt này!")

    transaction = get_booking_transaction_by_booking_id(
        db=db,
        booking_id=booking.id,
    )

    if transaction is None:
        raise ValueError("Lịch đặt này không có giao dịch thanh toán online!")

    return transaction


def expire_booking_transaction(db: Session, transaction: BookingTransaction) -> None:
    booking = db.query(Booking).filter(Booking.id == transaction.booking_id).first()

    if booking is None:
        raise ValueError("Lịch đặt của giao dịch không còn tồn tại!")

    if booking.booking_status != BookingStatus.PENDING:
        raise ValueError(
            "Chỉ có thể xử lý hết hạn thanh toán cho lịch đặt đang chờ xác nhận!"
        )

    booking.booking_status = BookingStatus.CANCELLED
    booking.cancelled_at = datetime.now()
    booking.cancelled_by = booking.user_id
    transaction.status = TransactionStatus.EXPIRED


def expire_booking_payment(
    db: Session, booking_id: int, user: User
) -> BookingTransaction:
    transaction = get_user_booking_transaction(db=db, booking_id=booking_id, user=user)

    if transaction.status == TransactionStatus.EXPIRED:
        raise ValueError("Giao dịch đã hết hạn thanh toán!")

    if transaction.status != TransactionStatus.PENDING:
        raise ValueError("Giao dịch không còn ở trạng thái chờ thanh toán!")

    if datetime.now() < transaction.expires_at:
        raise ValueError("Giao dịch vẫn còn thời hạn thanh toán!")

    expire_booking_transaction(db=db, transaction=transaction)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return transaction


def get_booking_payment(
    db: Session, booking_id: int, user: User
) -> tuple[BookingTransaction, str | None]:
    transaction = get_user_booking_transaction(
        db=db,
        booking_id=booking_id,
        user=user,
    )

    qr_url = None

    if (
        transaction.status == TransactionStatus.PENDING
        and datetime.now() < transaction.expires_at
    ):
        qr_url = generate_booking_qr_url(transaction)

    return transaction, qr_url


def request_booking_payment_confirmation(
    db: Session, booking_id: int, user: User
) -> BookingTransaction:
    transaction = get_user_booking_transaction(
        db=db,
        booking_id=booking_id,
        user=user,
    )

    if transaction.status == TransactionStatus.WAITING_CONFIRM:
        raise ValueError("Giao dịch đã được gửi đến admin để chờ xác nhận!")

    if transaction.status != TransactionStatus.PENDING:
        raise ValueError("Giao dịch không còn ở trạng thái chờ thanh toán!")

    if datetime.now() >= transaction.expires_at:
        expire_booking_payment(db=db, booking_id=booking_id, user=user)

        raise ValueError("Giao dịch đã quá hạn thanh toán!")

    transaction.status = TransactionStatus.WAITING_CONFIRM

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return transaction
