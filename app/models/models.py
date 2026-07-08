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


class AdoptionStatus(enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    ADOPTED = "ADOPTED"

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
    updated_at = Column(DateTime, default=func.now())

    bookings = relationship("Booking", back_populates="user")
    orders = relationship("Order", back_populates="user")
    rescue_pets = relationship("RescuePet", back_populates="user")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)

    order_details = relationship("OrderDetail", back_populates="product")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)

    bookings = relationship("Booking", back_populates="service")

class RescuePet(Base):
    __tablename__ = "rescue_pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    health_status = Column(Text, nullable=True)
    image = Column(String(255), nullable=True)
    adoption_status = Column(Enum(AdoptionStatus), default=AdoptionStatus.AVAILABLE, nullable=False)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())

    user_reserved = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="rescue_pets")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    booking_date = Column(DateTime, nullable=False)


    pet_name = Column(String(100), nullable=False)
    pet_type = Column(String(50), nullable=False)
    pet_weight = Column(Float, nullable=False)
    note = Column(Text, nullable=True)

    final_price = Column(Float, nullable=False)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")

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

    user = relationship("User", back_populates="orders")
    order_details = relationship(
        "OrderDetail", back_populates="order", cascade="all, delete-orphan"
    )

class OrderDetail(Base):
    __tablename__ = "order_details"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="order_details")
    product = relationship("Product", back_populates="order_details")
