from pydantic import BaseModel


class TawkIdentityResponse(BaseModel):
    user_id: str
    hash: str
    name: str
