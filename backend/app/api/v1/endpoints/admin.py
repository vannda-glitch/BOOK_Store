from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ....database import get_db
from ....models import User, Order, Book, Review
from ....schemas import DashboardStats
from ....auth import get_current_admin_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.payment_status == "paid").scalar() or 0
    total_books = db.query(Book).filter(Book.is_active == True).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    low_stock = db.query(Book).filter(Book.is_active == True, Book.stock_quantity <= 5).count()
    
    return DashboardStats(
        total_users=total_users,
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        total_books=total_books,
        pending_orders=pending_orders,
        low_stock_items=low_stock
    )