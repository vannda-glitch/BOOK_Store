from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models import User, Book
from ....schemas import WishlistResponse
from ....auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=WishlistResponse)
async def get_wishlist(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db.refresh(current_user)
    return WishlistResponse(items=current_user.wishlist, total_items=len(current_user.wishlist))

@router.post("/items/{book_id}")
async def add_to_wishlist(
    book_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id, Book.is_active == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book in current_user.wishlist:
        return {"message": "Book already in wishlist"}
    
    current_user.wishlist.append(book)
    db.commit()
    return {"message": "Book added to wishlist"}

@router.delete("/items/{book_id}")
async def remove_from_wishlist(
    book_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book not in current_user.wishlist:
        raise HTTPException(status_code=404, detail="Book not in wishlist")
    
    current_user.wishlist.remove(book)
    db.commit()
    return {"message": "Book removed from wishlist"}