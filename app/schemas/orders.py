from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.models import OrderStatus, PaymentMethod


class OrderBase(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=10000)
    payment_method: PaymentMethod = PaymentMethod.CASH


class OrderCreate(OrderBase):
    receiver_address: str | None = Field(default=None, max_length=255)

    @field_validator("receiver_address")
    @classmethod
    def validate_receiver_address(cls, receiver_address: str | None) -> str | None:
        if receiver_address is None:
            return None

        clean_receiver_address = receiver_address.strip()
        if not clean_receiver_address:
            return None
        return clean_receiver_address


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    receiver_full_name: str
    receiver_phone_number: str
    receiver_address: str
    unit_price: float
    total_price: float
    order_status: OrderStatus
    created_at: datetime
    updated_at: datetime
    cancelled_at: datetime | None
    cancelled_by: int | None
