from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.models import OrderStatus, PaymentMethod


class OrderBase(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=10000)
    receiver_address: str
    payment_method: PaymentMethod = PaymentMethod.CASH

    @field_validator("receiver_address")
    @classmethod
    def validate_receiver_address(cls, receiver_address: str) -> str:
        clean_receiver_address = receiver_address.strip()
        if not clean_receiver_address:
            raise ValueError("Địa chỉ giao hàng không được để trống!")
        if len(clean_receiver_address) > 255:
            raise ValueError("Địa chỉ giao hàng không được dài quá 255 ký tự!")
        return clean_receiver_address


class OrderCreate(OrderBase):
    pass


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    receiver_full_name: str
    receiver_phone_number: str
    unit_price: float
    total_price: float
    order_status: OrderStatus
    created_at: datetime
    updated_at: datetime
    cancelled_at: datetime | None
    cancelled_by: int | None
