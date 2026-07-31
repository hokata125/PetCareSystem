from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.models import TransactionStatus


class OrderTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    amount: float
    status: TransactionStatus
    transaction_code: str
    created_at: datetime
    expires_at: datetime
    paid_at: datetime | None


class OrderPaymentResponse(BaseModel):
    transaction: OrderTransactionResponse
    bank_account: str
    bank_code: str
    qr_url: str | None
