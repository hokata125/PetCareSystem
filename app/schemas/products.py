from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    price: float = Field(gt=0)
    stock_quantity: int = Field(ge=0)
    image: str | None = Field(default=None, max_length=255)

    @field_validator("name")
    @classmethod
    def validate_name(cls, name: str) -> str:
        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Tên sản phẩm không được để trống!")
        return clean_name


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
