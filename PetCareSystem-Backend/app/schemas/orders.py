from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.models import OrderStatus, PaymentMethod


class OrderBase(BaseModel):
    product_id: int = Field(gt=0)
    note: str | None = None
    quantity: int = Field(ge=1, le=10000)


class OrderCreate(OrderBase):
    receiver_address: str | None = None

    @field_validator("receiver_address")
    @classmethod
    def validate_receiver_address(cls, receiver_address: str | None) -> str | None:
        if receiver_address is None:
            return None
        clean_receiver_address = receiver_address.strip()
        if not clean_receiver_address:
            return None
        if len(clean_receiver_address) > 255:
            raise ValueError("Địa chỉ không được dài quá 255 ký tự!")
        return clean_receiver_address


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    receiver_full_name: str
    receiver_phone_number: str
    receiver_address: str
    product_name: str
    unit_price: float
    total_price: float
    payment_method: PaymentMethod
    order_status: OrderStatus
    created_at: datetime
    updated_at: datetime
    cancelled_at: datetime | None
    cancelled_by: int | None
