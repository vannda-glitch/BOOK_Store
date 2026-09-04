from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....database import get_db
from ....models import User, Order
from ....schemas import OrderResponse
from ....auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.post("/{order_id}/pay")
async def pay_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.payment_status = "paid"
    db.commit()
    return {"message": "Payment successful", "order_id": order.id}

@router.get("/{order_id}/status")
async def get_payment_status(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "order_id": order.id,
        "payment_status": order.payment_status,
        "total_amount": order.total_amount
    }