from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.depends import get_current_user
from app.db.session import get_db
from app.models.models import User
from app.schemas.orders import OrderCreate, OrderResponse
from app.services.orders import (
    cancel_order,
    create_order,
    get_order_by_id,
    get_user_orders,
)

router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_my_order(
    order_input_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_order(
            db=db,
            user=current_user,
            order_input_data=order_input_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get("", response_model=list[OrderResponse])
def get_my_orders(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_orders(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_my_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = get_order_by_id(db, order_id)

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng!",
        )

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này!",
        )

    return order


@router.patch("/{order_id}/cancel", response_model=OrderResponse)
def cancel_my_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return cancel_order(
            db=db,
            order_id=order_id,
            user=current_user,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
