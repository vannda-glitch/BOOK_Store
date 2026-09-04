from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....database import get_db
from ....models import Author, User
from ....schemas import AuthorResponse, AuthorCreate, AuthorUpdate
from ....auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[AuthorResponse])
async def get_authors(db: Session = Depends(get_db)):
    return db.query(Author).filter(Author.is_active == True).all()

@router.get("/{author_id}", response_model=AuthorResponse)
async def get_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author

@router.post("/", response_model=AuthorResponse)
async def create_author(
    author_data: AuthorCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    author = Author(**author_data.model_dump())
    db.add(author)
    db.commit()
    db.refresh(author)
    return author

@router.put("/{author_id}", response_model=AuthorResponse)
async def update_author(
    author_id: int,
    author_data: AuthorUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    for field, value in author_data.model_dump(exclude_unset=True).items():
        setattr(author, field, value)
    
    db.commit()
    db.refresh(author)
    return author

@router.delete("/{author_id}")
async def delete_author(
    author_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    author.is_active = False
    db.commit()
    return {"message": "Author deleted successfully"}