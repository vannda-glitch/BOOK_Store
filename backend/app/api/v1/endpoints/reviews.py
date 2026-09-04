from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....database import get_db
from ....models import User, Review, Book
from ....schemas import ReviewCreate, ReviewResponse
from ....auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.get("/book/{book_id}", response_model=List[ReviewResponse])
async def get_book_reviews(book_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.book_id == book_id, Review.is_approved == True).all()

@router.post("/", response_model=ReviewResponse)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == review_data.book_id, Book.is_active == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    existing = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.book_id == review_data.book_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already reviewed this book")
    
    review = Review(user_id=current_user.id, **review_data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.put("/{review_id}/approve")
async def approve_review(
    review_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.is_approved = True
    db.commit()
    return {"message": "Review approved"}

@router.delete("/{review_id}")
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.user_id == current_user.id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}