from pydantic import BaseModel, EmailStr


class TawkIdentityResponse(BaseModel):
    user_id: str
    hash: str
    name: str
    email: EmailStr
