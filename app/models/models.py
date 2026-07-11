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
    func,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 
import cloudinary
import enum

class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    CUSTOMER = "CUSTOMER"


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
    CASH = "CASH"
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


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    dob = Column(Date, nullable=False)
    phone_number = Column(String(10), nullable=False)
    address = Column(String(255), nullable=True)
    avatar = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER, nullable=False)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

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
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)

    order_details = relationship("OrderDetail", foreign_keys="OrderDetail.product_id")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
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

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

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

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

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

    payment_method = Column(
        Enum(PaymentMethod), default=PaymentMethod.CASH, nullable=False
    )

    final_price = Column(Float, nullable=False)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    cancelled_at = Column(DateTime, nullable=True)
    cancelled_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    order_status = Column(
        Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False
    )
    payment_method = Column(
        Enum(PaymentMethod), default=PaymentMethod.CASH, nullable=False
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    cancelled_at = Column(DateTime, nullable=True)
    cancelled_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    order_details = relationship(
        "OrderDetail", cascade="all, delete-orphan", foreign_keys="OrderDetail.order_id"
    )

class OrderDetail(Base):
    __tablename__ = "order_details"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

