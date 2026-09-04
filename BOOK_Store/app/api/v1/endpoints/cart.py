from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....database import get_db
from ....models import Publisher, User
from ....schemas import PublisherResponse, PublisherCreate, PublisherUpdate
from ....auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[PublisherResponse])
async def get_publishers(db: Session = Depends(get_db)):
    return db.query(Publisher).filter(Publisher.is_active == True).all()

@router.get("/{publisher_id}", response_model=PublisherResponse)
async def get_publisher(publisher_id: int, db: Session = Depends(get_db)):
    publisher = db.query(Publisher).filter(Publisher.id == publisher_id).first()
    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")
    return publisher

@router.post("/", response_model=PublisherResponse)
async def create_publisher(
    publisher_data: PublisherCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    publisher = Publisher(**publisher_data.model_dump())
    db.add(publisher)
    db.commit()
    db.refresh(publisher)
    return publisher

@router.put("/{publisher_id}", response_model=PublisherResponse)
async def update_publisher(
    publisher_id: int,
    publisher_data: PublisherUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    publisher = db.query(Publisher).filter(Publisher.id == publisher_id).first()
    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")
    
    for field, value in publisher_data.model_dump(exclude_unset=True).items():
        setattr(publisher, field, value)
    
    db.commit()
    db.refresh(publisher)
    return publisher

@router.delete("/{publisher_id}")
async def delete_publisher(
    publisher_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    publisher = db.query(Publisher).filter(Publisher.id == publisher_id).first()
    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")
    
    publisher.is_active = False
    db.commit()
    return {"message": "Publisher deleted successfully"}