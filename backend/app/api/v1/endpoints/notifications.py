from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....database import get_db
from ....models import User
from ....auth import get_current_active_user

router = APIRouter()

@router.get("/")
async def get_notifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return {"notifications": [], "total": 0}

@router.post("/")
async def create_notification(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return {"message": "Notification created"}