from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.models import PetStatus


class AbandonedPetBase(BaseModel):
    name: str = Field(max_length=255)
    pet_type: str = Field(max_length=100)
    age: int = Field(gt=0)
    weight: float = Field(ge=1, le=100)
    health_status: str
    image: str | None = Field(default=None, max_length=255)
    pet_status: PetStatus = PetStatus.AVAILABLE

    @field_validator("name")
    @classmethod
    def validate_name(cls, name: str) -> str:
        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Tên thú cưng không được để trống!")
        return clean_name

    @field_validator("pet_type")
    @classmethod
    def validate_pet_type(cls, pet_type: str) -> str:
        clean_pet_type = pet_type.strip()
        if not clean_pet_type:
            raise ValueError("Loại thú cưng không được để trống!")
        return clean_pet_type

    @field_validator("health_status")
    @classmethod
    def validate_health_status(cls, health_status: str) -> str:
        clean_health_status = health_status.strip()
        if not clean_health_status:
            raise ValueError("Tình trạng sức khỏe không được để trống!")
        return clean_health_status


class AbandonedPetResponse(AbandonedPetBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
