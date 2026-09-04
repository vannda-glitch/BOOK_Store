from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets
from ....database import get_db
from ....models import User, Order, OrderItem, CartItem, Book
from ....schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from ....auth import get_current_active_user, get_current_admin_user

router = APIRouter()

def generate_order_number():
    return f"ORD-{datetime.now().strftime('%Y%m%d')}-{secrets.token_hex(4).upper()}"

@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    subtotal = 0
    items_data = []
    for item in cart_items:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        if not book or not book.is_active:
            raise HTTPException(status_code=400, detail=f"Book {item.book_id} unavailable")
        if book.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {book.title}")
        
        price = book.discount_price or book.price
        total_price = price * item.quantity
        subtotal += total_price
        items_data.append({
            "book_id": book.id,
            "quantity": item.quantity,
            "unit_price": price,
            "total_price": total_price
        })
    
    total_amount = subtotal
    
    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id,
        subtotal=subtotal,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        payment_method=order_data.payment_method,
        notes=order_data.notes
    )
    db.add(order)
    db.flush()
    
    for item in items_data:
        order_item = OrderItem(order_id=order.id, **item)
        db.add(order_item)
        
        book = db.query(Book).filter(Book.id == item["book_id"]).first()
        if book:
            book.stock_quantity -= item["quantity"]
    
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    db.commit()
    return {"message": "Order status updated"}

@router.delete("/{order_id}")
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in ["pending", "processing"]:
        raise HTTPException(status_code=400, detail="Cannot cancel order in current status")
    
    order.status = "cancelled"
    for item in order.items:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        if book:
            book.stock_quantity += item.quantity
    db.commit()
    return {"message": "Order cancelled"}