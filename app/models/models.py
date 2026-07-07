from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 
import cloudinary
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(10), nullable=False)
    role = Column(String(20), default="CUSTOMER")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    bookings = relationship("Booking", back_populates="user")
    orders = relationship("Order", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True) 


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)  
    price_small = Column(Float, nullable=False)   
    price_medium = Column(Float, nullable=False)
    price_large = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)


# 4. Bảng Đặt lịch Dịch vụ (Gộp Spa + Khám + Trông hộ)
class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    
    booking_date = Column(String(10), nullable=False)
    time_slot = Column(String(20), nullable=False)     # VD: "08:00 - 09:00"
    
    # Thông tin thú cưng khách tự điền
    pet_name = Column(String(255), nullable=False)
    pet_type = Column(String(255), nullable=False)      # Chó, Mèo, Khác...
    pet_weight = Column(Float, nullable=False)         # Cân nặng để tính giá
    
    final_price = Column(Float, nullable=False)        # Giá tự động tính theo cân nặng
    note = Column(Text, nullable=True)
    status = Column(String(20), default="PENDING")     # PENDING, CONFIRMED, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="bookings")
    service = relationship("Service")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="PENDING")
    payment_method = Column(String(20), default="COD")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")


class RescuePet(Base):
    __tablename__ = "rescue_pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=True)
    health_status = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    status = Column(String(255), default="AVAILABLE")


    reserved_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reserved_by = relationship("User")