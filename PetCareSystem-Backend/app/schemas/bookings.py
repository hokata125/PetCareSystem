from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.models.models import BookingStatus, PaymentMethod


class BookingBase(BaseModel):
    service_id: int = Field(gt=0)
    pet_name: str
    pet_type: str
    pet_weight: float = Field(ge=1, le=50)
    note: str | None = None

    @field_validator("pet_name")
    @classmethod
    def validate_pet_name(cls, pet_name: str) -> str:
        clean_pet_name = pet_name.strip()
        if not clean_pet_name:
            raise ValueError("Tên thú cưng không được để trống!")
        if len(clean_pet_name) > 255:
            raise ValueError("Tên thú cưng không được dài quá 255 ký tự!")
        return clean_pet_name

    @field_validator("pet_type")
    @classmethod
    def validate_pet_type(cls, pet_type: str) -> str:
        clean_pet_type = pet_type.strip()
        if not clean_pet_type:
            raise ValueError("Loại thú cưng không được để trống!")
        if len(clean_pet_type) > 255:
            raise ValueError("Loại thú cưng không được dài quá 255 ký tự!")
        return clean_pet_type


class BookingCreate(BookingBase):
    start_at: datetime
    end_at: datetime | None = None

    @field_validator("start_at")
    @classmethod
    def validate_start(cls, start_at: datetime) -> datetime:
        if start_at <= datetime.now():
            raise ValueError("Thời gian bắt đầu phải ở tương lai!")

        if start_at.minute not in {0, 15, 30, 45}:
            raise ValueError("Phút đặt lịch chỉ được là 00, 15, 30 hoặc 45!")

        if start_at.second or start_at.microsecond:
            raise ValueError("Thời gian bắt đầu không được chứa giây!")

        return start_at

    @field_validator("end_at")
    @classmethod
    def validate_end(cls, end_at: datetime | None) -> datetime | None:
        if end_at is None:
            return None

        if end_at.minute not in {0, 15, 30, 45}:
            raise ValueError("Phút kết thúc chỉ được là 00, 15, 30 hoặc 45!")

        if end_at.second or end_at.microsecond:
            raise ValueError("Thời gian kết thúc không được chứa giây!")

        return end_at

    @model_validator(mode="after")
    def validate_booking_time(self):
        if self.end_at is not None and self.end_at <= self.start_at:
            raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu!")

        return self


class BookingResponse(BookingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    customer_full_name: str
    customer_phone_number: str
    customer_address: str
    service_name: str
    start_at: datetime
    end_at: datetime
    base_price: float
    final_price: float
    payment_method: PaymentMethod
    booking_status: BookingStatus
    created_at: datetime
    updated_at: datetime
    cancelled_at: datetime | None
    cancelled_by: int | None
