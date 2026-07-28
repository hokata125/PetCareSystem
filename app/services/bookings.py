from datetime import datetime, time, timedelta

from sqlalchemy.orm import Session

from app.models.models import (
    Booking,
    BookingStatus,
    Service,
    ServiceType,
    User,
)
from app.schemas.bookings import BookingCreate
from app.services.services import get_service_by_id

FIXED_SERVICE_DURATION = timedelta(hours=2)
FIXED_SERVICE_CAPACITY = 5

OPENING_TIME = time(8, 0)
CLOSING_TIME = time(20, 0)


def get_booking_by_id(
    db: Session,
    booking_id: int,
) -> Booking | None:
    return db.query(Booking).filter(Booking.id == booking_id).first()


def get_user_bookings(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 10,
) -> list[Booking]:
    return (
        db.query(Booking)
        .filter(Booking.user_id == user_id)
        .order_by(Booking.start_at.desc(), Booking.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def calculate_end_at(
    service_type: ServiceType,
    input_start_at: datetime,
    input_end_at: datetime | None,
) -> datetime:
    if service_type == ServiceType.BOARDING:
        if input_end_at is None:
            raise ValueError("Dịch vụ trông hộ yêu cầu thời gian kết thúc!")
        return input_end_at

    return input_start_at + FIXED_SERVICE_DURATION


def validate_booking_hours(
    service_type: ServiceType,
    input_start_at: datetime,
    input_end_at: datetime,
) -> None:
    if not OPENING_TIME <= input_start_at.time() < CLOSING_TIME:
        raise ValueError(
            "Thời gian bắt đầu phải nằm trong khung giờ làm việc 8:00 - 20:00!"
        )

    if not OPENING_TIME <= input_end_at.time() <= CLOSING_TIME:
        raise ValueError(
            "Thời gian kết thúc phải nằm trong khung giờ làm việc 8:00 - 20:00!"
        )

    if input_start_at < datetime.now() + timedelta(minutes=30):
        raise ValueError("Lịch hẹn phải được đặt trước ít nhất 30 phút!")

    if (
        service_type != ServiceType.BOARDING
        and input_start_at.date() != input_end_at.date()
    ):
        raise ValueError("Dịch vụ này phải bắt đầu và kết thúc trong cùng một ngày!")


def validate_service_capacity(
    db: Session,
    service_type: ServiceType,
    input_start_at: datetime,
) -> None:
    booking_count = (
        db.query(Booking)
        .join(Service, Booking.service_id == Service.id)
        .filter(
            Service.service_type == service_type,
            Booking.start_at == input_start_at,
            Booking.booking_status.in_(
                [
                    BookingStatus.PENDING,
                    BookingStatus.CONFIRMED,
                    BookingStatus.IN_PROGRESS,
                ]
            ),
        )
        .count()
    )

    if booking_count >= FIXED_SERVICE_CAPACITY:
        raise ValueError(
            "Khung giờ bắt đầu này đã đủ 5 lịch đặt. Vui lòng chọn giờ khác!"
        )


def calculate_final_price(
    service: Service,
    pet_weight: float,
    start_at: datetime,
    end_at: datetime,
) -> float:
    if service.service_type == ServiceType.BOARDING:
        duration_hours = (end_at - start_at).total_seconds() / 3600
        return round(service.price * duration_hours, 2)

    if pet_weight < 10:
        price_increase = 1
    elif pet_weight < 20:
        price_increase = 1.1
    else:
        price_increase = 1.3

    return round(service.price * price_increase, 2)


def create_booking(
    db: Session,
    user: User,
    booking_input_data: BookingCreate,
) -> Booking:
    service = get_service_by_id(db, booking_input_data.service_id)

    if service is None:
        raise ValueError("Dịch vụ không tồn tại hoặc đã ngừng hoạt động!")

    calculated_end_at = calculate_end_at(
        service_type=service.service_type,
        input_start_at=booking_input_data.start_at,
        input_end_at=booking_input_data.end_at,
    )

    validate_booking_hours(
        service_type=service.service_type,
        input_start_at=booking_input_data.start_at,
        input_end_at=calculated_end_at,
    )

    if service.service_type != ServiceType.BOARDING:
        validate_service_capacity(
            db=db,
            service_type=service.service_type,
            input_start_at=booking_input_data.start_at,
        )

    calculated_final_price = calculate_final_price(
        service=service,
        pet_weight=booking_input_data.pet_weight,
        start_at=booking_input_data.start_at,
        end_at=calculated_end_at,
    )

    booking = Booking(
        user_id=user.id,
        customer_full_name=user.full_name,
        customer_phone_number=user.phone_number,
        customer_address=user.address,
        service_id=service.id,
        service_name=service.name,
        start_at=booking_input_data.start_at,
        end_at=calculated_end_at,
        pet_name=booking_input_data.pet_name,
        pet_type=booking_input_data.pet_type,
        pet_weight=booking_input_data.pet_weight,
        note=booking_input_data.note,
        base_price=service.price,
        final_price=calculated_final_price,
        payment_method=booking_input_data.payment_method,
    )

    try:
        db.add(booking)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return booking


def cancel_booking(
    db: Session,
    booking_id: int,
    user: User,
) -> Booking:
    booking = get_booking_by_id(db, booking_id)

    if booking is None:
        raise ValueError("Lịch đặt không tồn tại!")

    if booking.user_id != user.id:
        raise ValueError("Bạn không có quyền hủy lịch đặt này!")

    if booking.booking_status != BookingStatus.PENDING:
        raise ValueError("Chỉ có thể hủy lịch đặt đang chờ xác nhận!")

    booking.booking_status = BookingStatus.CANCELLED
    booking.cancelled_at = datetime.now()
    booking.cancelled_by = user.id

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return booking
