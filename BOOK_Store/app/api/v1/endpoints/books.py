from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from typing import List, Optional
from ....database import get_db
from ....models import Book, Category, Author, Publisher, Review, User
from ....schemas import BookCreate, BookUpdate, BookResponse, SearchResponse, SearchParams
from ....auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=SearchResponse)
async def get_books(
    query: Optional[str] = None,
    category_id: Optional[int] = None,
    author_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "created_at",
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db)
):
    book_query = db.query(Book).filter(Book.is_active == True)
    
    if query:
        book_query = book_query.filter(
            or_(
                Book.title.ilike(f"%{query}%"),
                Book.description.ilike(f"%{query}%"),
                Book.isbn.ilike(f"%{query}%")
            )
        )
    if category_id:
        book_query = book_query.filter(Book.category_id == category_id)
    if author_id:
        book_query = book_query.filter(Book.author_id == author_id)
    if min_price is not None:
        book_query = book_query.filter(Book.price >= min_price)
    if max_price is not None:
        book_query = book_query.filter(Book.price <= max_price)
    
    sort_column = getattr(Book, sort_by, Book.created_at)
    book_query = book_query.order_by(sort_column.desc())
    
    total = book_query.count()
    books = book_query.offset((page - 1) * per_page).limit(per_page).all()
    
    return SearchResponse(
        items=books,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )

@router.get("/featured", response_model=List[BookResponse])
async def get_featured_books(limit: int = 10, db: Session = Depends(get_db)):
    books = db.query(Book).filter(Book.is_featured == True, Book.is_active == True).limit(limit).all()
    return books

@router.get("/bestsellers", response_model=List[BookResponse])
async def get_bestseller_books(limit: int = 10, db: Session = Depends(get_db)):
    books = db.query(Book).filter(Book.is_bestseller == True, Book.is_active == True).limit(limit).all()
    return books

@router.get("/new-arrivals", response_model=List[BookResponse])
async def get_new_arrivals(limit: int = 10, db: Session = Depends(get_db)):
    books = db.query(Book).filter(Book.is_new_arrival == True, Book.is_active == True).limit(limit).all()
    return books

@router.get("/{book_id}", response_model=BookResponse)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id, Book.is_active == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.book_id == book.id).scalar() or 0
    book.average_rating = round(float(avg_rating), 1)
    return book

@router.get("/{book_id}/related", response_model=List[BookResponse])
async def get_related_books(book_id: int, limit: int = 5, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    related = db.query(Book).filter(
        Book.is_active == True,
        Book.id != book_id,
        Book.category_id == book.category_id
    ).limit(limit).all()
    return related

# Admin endpoints
@router.post("/", response_model=BookResponse)
async def create_book(
    book_data: BookCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    if db.query(Book).filter(Book.slug == book_data.slug).first():
        raise HTTPException(status_code=400, detail="Slug already taken")
    if book_data.isbn and db.query(Book).filter(Book.isbn == book_data.isbn).first():
        raise HTTPException(status_code=400, detail="ISBN already exists")
    
    book = Book(**book_data.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: int,
    book_data: BookUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    for field, value in book_data.model_dump(exclude_unset=True).items():
        setattr(book, field, value)
    
    db.commit()
    db.refresh(book)
    return book

@router.delete("/{book_id}")
async def delete_book(
    book_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.is_active = False
    db.commit()
    return {"message": "Book deleted successfully"}