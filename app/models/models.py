from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
import enum

class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    CUSTOMER = "CUSTOMER"

class Gender(enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"

class ServiceType(enum.Enum):
    SPA = "SPA"
    CLINIC = "CLINIC"
    BOARDING = "BOARDING"


class BookingStatus(enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class PaymentMethod(enum.Enum):
    COD = "COD"
    TRANSFER = "TRANSFER"


class PetStatus(enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    ADOPTED = "ADOPTED"


class AdoptionStatus(enum.Enum):
    PENDING = "PENDING"
    CANCELLED = "CANCELLED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class TransactionStatus(enum.Enum):
    PENDING = "PENDING"
    WAITING_CONFIRM = "WAITING_CONFIRM"
    SUCCESS = "SUCCESS"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    dob = Column(Date, nullable=False)
    phone_number = Column(String(10), unique=True, nullable=False)
    address = Column(String(255), default=None, nullable=True)
    avatar = Column(String(255), default="https://res.cloudinary.com/vgvqzopy/image/upload/v1784111514/avatar-default_bylut2.jpg", nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    bookings = relationship("Booking", foreign_keys="Booking.user_id")
    adoptions = relationship("Adoption", foreign_keys="Adoption.user_id")
    orders = relationship("Order", foreign_keys="Order.user_id")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    is_active = Column(Boolean, default=True)

    orders = relationship("Order", foreign_keys="Order.product_id")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    is_active = Column(Boolean, default=True)

    bookings = relationship("Booking", foreign_keys="Booking.service_id")


class AbandonedPet(Base):
    __tablename__ = "abandoned_pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    health_status = Column(Text, nullable=True)
    image = Column(String(255), nullable=True)
    pet_status = Column(Enum(PetStatus), default=PetStatus.AVAILABLE, nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    adoptions = relationship("Adoption", foreign_keys="Adoption.abandoned_pet_id")


class Adoption(Base):
    __tablename__ = "adoptions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    abandoned_pet_id = Column(Integer, ForeignKey("abandoned_pets.id"), nullable=False)

    status = Column(
        Enum(AdoptionStatus),
        default=AdoptionStatus.PENDING,
        nullable=False,
    )

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    cancelled_at = Column(DateTime, nullable=True)
    cancelled_by = Column(Integer, ForeignKey("users.id"), nullable=True)



class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)

    start_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=True)
    end_at = Column(DateTime, nullable=True)

    pet_name = Column(String(100), nullable=False)
    pet_type = Column(String(50), nullable=False)
    pet_weight = Column(Float, nullable=False)
    note = Column(Text, nullable=True)

    final_price = Column(Float, nullable=False)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    cancelled_at = Column(DateTime, nullable=True)
    cancelled_by = Column(Integer, ForeignKey("users.id"), nullable=True)

class BookingTransaction(Base):
    __tablename__ = "booking_transactions"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)

    amount = Column(Float, nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING, nullable=False)

    transaction_code = Column(String(100), unique=True, nullable=False)

    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=False)
    paid_at = Column(DateTime, nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    order_status = Column(
        Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False
    )
    payment_method = Column(
        Enum(PaymentMethod), default=PaymentMethod.COD, nullable=False
    )

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    cancelled_at = Column(DateTime, nullable=True)
    cancelled_by = Column(Integer, ForeignKey("users.id"), nullable=True)

class OrderTransaction(Base):
    __tablename__ = "order_transactions"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)

    amount = Column(Float, nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING, nullable=False)

    transaction_code = Column(String(100), unique=True, nullable=False)

    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=False)
    paid_at = Column(DateTime, nullable=True)

