import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.models import Gender, UserRole


class UserBase(BaseModel):
    username: str
    full_name: str
    gender: Gender
    email: EmailStr = Field(max_length=255)
    dob: date
    phone_number: str
    address: str = Field(max_length=255)

    @field_validator("username")
    @classmethod
    def validate_username(cls, username: str) -> str:
        clean_username = username.strip()
        if not clean_username:
            raise ValueError("Tên tài khoản không được để trống!")
        if len(clean_username) < 5:
            raise ValueError("Tên tài khoản phải có ít nhất 5 ký tự!")
        if len(clean_username) > 255:
            raise ValueError("Tên tài khoản không được vượt quá 255 ký tự!")
        if not re.fullmatch(r"^[a-zA-Z0-9]+$", clean_username):
            raise ValueError("Tên tài khoản không được chứa ký tự đặc biệt!")
        return clean_username

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, full_name: str) -> str:
        clean_full_name = full_name.strip()
        if not clean_full_name:
            raise ValueError("Họ và tên không được để trống!")
        if len(clean_full_name) < 5:
            raise ValueError("Họ và tên phải có ít nhất 5 ký tự!")
        if len(clean_full_name) > 255:
            raise ValueError("Họ và tên không được vượt quá 255 ký tự!")
        if not re.fullmatch(r"^[a-zA-ZÀ-ỹ ]+$", clean_full_name):
            raise ValueError("Họ và tên chỉ được chữ cái và khoảng trắng!")
        return clean_full_name

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, phone_number: str) -> str:
        clean_phone_number = phone_number.strip()
        if not re.fullmatch(r"0[0-9]{9}", clean_phone_number):
            raise ValueError(
                "Số điện thoại phải bắt đầu bằng 0 và chứa đúng 10 chữ số!"
            )
        return clean_phone_number

    @field_validator("address")
    @classmethod
    def validate_address(cls, address: str) -> str:
        clean_address = address.strip()
        if not clean_address:
            raise ValueError("Địa chỉ không được để trống!")
        return clean_address

    @field_validator("dob")
    @classmethod
    def validate_dob(cls, dob: date) -> date:
        if dob > date.today() or dob < date(1900, 1, 1):
            raise ValueError("Ngày sinh không hợp lệ!")
        return dob


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        if not password.strip():
            raise ValueError("Mật khẩu không được để trống!")
        if len(password) < 8:
            raise ValueError("Mật khẩu phải có ít nhất 8 ký tự!")
        if len(password) > 255:
            raise ValueError("Mật khẩu không được vượt quá 255 ký tự!")
        if not (re.search(r"[0-9]", password) and re.search(r"[a-zA-Z]", password)):
            raise ValueError("Mật khẩu phải chứa cả ký tự chữ và ký tự số!")
        return password


class UserLogin(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, username: str) -> str:
        clean_username = username.strip()
        if not clean_username:
            raise ValueError("Tên tài khoản không được để trống!")
        if len(clean_username) < 5:
            raise ValueError("Tên tài khoản phải có ít nhất 5 ký tự!")
        if len(clean_username) > 255:
            raise ValueError("Tên tài khoản không được vượt quá 255 ký tự!")
        if not re.fullmatch(r"^[a-zA-Z0-9]+$", clean_username):
            raise ValueError("Tên tài khoản không được chứa ký tự đặc biệt!")
        return clean_username

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        if not password.strip():
            raise ValueError("Mật khẩu không được để trống!")
        if len(password) < 8:
            raise ValueError("Mật khẩu phải có ít nhất 8 ký tự!")
        if len(password) > 255:
            raise ValueError("Mật khẩu không được vượt quá 255 ký tự!")
        if not (re.search(r"[0-9]", password) and re.search(r"[a-zA-Z]", password)):
            raise ValueError("Mật khẩu phải chứa cả ký tự chữ và ký tự số!")
        return password


class UserUpdate(BaseModel):
    full_name: str | None = None
    gender: Gender | None = None
    email: EmailStr | None = Field(default=None, max_length=255)
    dob: date | None = None
    phone_number: str | None = None
    address: str | None = Field(default=None, max_length=255)
    password: str | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, full_name: str | None) -> str | None:
        if full_name is None:
            return None
        clean_full_name = full_name.strip()
        if not clean_full_name:
            raise ValueError("Họ và tên không được để trống!")
        if len(clean_full_name) < 5:
            raise ValueError("Họ và tên phải có ít nhất 5 ký tự!")
        if len(clean_full_name) > 255:
            raise ValueError("Họ và tên không được vượt quá 255 ký tự!")
        if not re.fullmatch(r"[a-zA-ZÀ-ỹ ]+", clean_full_name):
            raise ValueError("Họ và tên chỉ được chứa chữ cái!")
        return clean_full_name

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, phone_number: str | None) -> str | None:
        if phone_number is None:
            return None
        clean_phone_number = phone_number.strip()
        if not re.fullmatch(r"0[0-9]{9}", clean_phone_number):
            raise ValueError("Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số!")
        return clean_phone_number

    @field_validator("address")
    @classmethod
    def validate_address(cls, address: str | None) -> str | None:
        if address is None:
            return None
        clean_address = address.strip()
        if not clean_address:
            raise ValueError("Địa chỉ không được để trống!")
        return clean_address

    @field_validator("dob")
    @classmethod
    def validate_dob(cls, dob: date | None) -> date | None:
        if dob is None:
            return None
        if dob > date.today() or dob < date(1900, 1, 1):
            raise ValueError("Ngày sinh không hợp lệ!")
        return dob

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str | None) -> str | None:
        if password is None:
            return None
        if not password.strip():
            raise ValueError("Mật khẩu không được để trống!")
        if len(password) < 8:
            raise ValueError("Mật khẩu phải có ít nhất 8 ký tự!")
        if len(password) > 255:
            raise ValueError("Mật khẩu không được vượt quá 255 ký tự!")
        if not (re.search(r"[0-9]", password) and re.search(r"[a-zA-Z]", password)):
            raise ValueError("Mật khẩu phải chứa cả ký tự chữ và ký tự số!")
        return password


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    avatar: str
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime
