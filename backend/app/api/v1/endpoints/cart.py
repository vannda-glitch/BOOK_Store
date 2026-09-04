from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....database import get_db
from ....models import CartItem, Book, User
from ....schemas import CartItemResponse, CartItemCreate, CartItemUpdate, CartResponse
from ....auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    subtotal = sum(item.book.price * item.quantity for item in items if item.book)
    return CartResponse(
        items=items,
        subtotal=subtotal,
        total_items=sum(item.quantity for item in items)
    )

@router.post("/items", response_model=CartItemResponse)
async def add_to_cart(
    cart_data: CartItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == cart_data.book_id, Book.is_active == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.book_id == cart_data.book_id
    ).first()
    
    if cart_item:
        cart_item.quantity += cart_data.quantity
    else:
        cart_item = CartItem(
            user_id=current_user.id,
            book_id=cart_data.book_id,
            quantity=cart_data.quantity
        )
        db.add(cart_item)
    
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    cart_data: CartItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart_item.quantity = cart_data.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/items/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}

@router.delete("/")
async def clear_cart(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared successfully"}