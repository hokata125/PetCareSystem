from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.depends import get_current_user
from app.core.configs import settings
from app.db.session import get_db
from app.models.models import User
from app.schemas.booking_transactions import (
    BookingPaymentResponse,
    BookingTransactionResponse,
)
from app.services.booking_transactions import (
    expire_booking_payment,
    get_booking_payment,
    request_booking_payment_confirmation,
)

router = APIRouter()


@router.get("/{booking_id}/payment", response_model=BookingPaymentResponse)
def get_my_booking_payment(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        transaction, qr_url = get_booking_payment(
            db=db,
            booking_id=booking_id,
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


@router.patch(
    "/{booking_id}/payment/confirm", response_model=BookingTransactionResponse
)
def confirm_my_booking_payment(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return request_booking_payment_confirmation(
            db=db,
            booking_id=booking_id,
            user=current_user,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.patch("/{booking_id}/payment/expire", response_model=BookingTransactionResponse)
def expire_my_booking_payment(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return expire_booking_payment(
            db=db,
            booking_id=booking_id,
            user=current_user,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
