from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.depends import get_current_user
from app.core.configs import settings
from app.db.session import get_db
from app.models.models import User
from app.schemas.order_transactions import (
    OrderPaymentResponse,
    OrderTransactionResponse,
)
from app.services.order_transactions import (
    expire_order_payment,
    get_order_payment,
    request_order_payment_confirmation,
)

router = APIRouter()


@router.get("/{order_id}/payment", response_model=OrderPaymentResponse)
def get_my_order_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        transaction, qr_url = get_order_payment(
            db=db,
            order_id=order_id,
            user=current_user,
        )

        return {
            "transaction": transaction,
            "bank_account": settings.SEPAY_ACC,
            "bank_code": settings.SEPAY_BANK,
            "qr_url": qr_url,
        }
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.patch("/{order_id}/payment/confirm", response_model=OrderTransactionResponse)
def confirm_my_order_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return request_order_payment_confirmation(
            db=db,
            order_id=order_id,
            user=current_user,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.patch("/{order_id}/payment/expire", response_model=OrderTransactionResponse)
def expire_my_order_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return expire_order_payment(
            db=db,
            order_id=order_id,
            user=current_user,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
