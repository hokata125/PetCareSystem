from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.models import AdoptionStatus


class AdoptionBase(BaseModel):
    abandoned_pet_id: int = Field(gt=0)
    note: str | None = None


class AdoptionCreate(AdoptionBase):
    pass


class AdoptionResponse(AdoptionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    owner_full_name: str
    owner_phone_number: str
    owner_address: str
    pet_name: str
    pet_type: str
    pet_age: int
    pet_weight: float
    pet_health_status: str
    adoption_status: AdoptionStatus
    created_at: datetime
    updated_at: datetime
    cancelled_at: datetime | None
    cancelled_by: int | None
