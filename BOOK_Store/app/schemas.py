from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

# User Schemas
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str]
    phone: Optional[str]
    profile_picture: Optional[str]
    is_active: bool
    is_verified: bool
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None

class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

# Book Schemas
class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    
    class Config:
        from_attributes = True

class AuthorResponse(BaseModel):
    id: int
    name: str
    biography: Optional[str]
    nationality: Optional[str]
    
    class Config:
        from_attributes = True

class PublisherResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    
    class Config:
        from_attributes = True

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str]
    isbn: Optional[str]
    price: float
    discount_price: Optional[float]
    stock_quantity: int
    pages: Optional[int]
    language: Optional[str]
    publication_date: Optional[datetime]
    cover_image: Optional[str]
    is_featured: bool
    is_bestseller: bool
    is_new_arrival: bool
    author: Optional[AuthorResponse]
    publisher: Optional[PublisherResponse]
    category: Optional[CategoryResponse]
    reviews: List[ReviewResponse] = []
    average_rating: Optional[float] = 0
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    isbn: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    stock_quantity: int = 0
    pages: Optional[int] = None
    language: Optional[str] = None
    publication_date: Optional[datetime] = None
    author_id: int
    publisher_id: int
    category_id: int

class BookUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    is_featured: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    is_new_arrival: Optional[bool] = None
    is_active: Optional[bool] = None

# Category Schemas
class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

# Author Schemas
class AuthorCreate(BaseModel):
    name: str
    biography: Optional[str] = None
    nationality: Optional[str] = None

class AuthorUpdate(BaseModel):
    name: Optional[str] = None
    biography: Optional[str] = None
    nationality: Optional[str] = None
    is_active: Optional[bool] = None

# Publisher Schemas
class PublisherCreate(BaseModel):
    name: str
    description: Optional[str] = None

class PublisherUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

# Review Schemas
class ReviewCreate(BaseModel):
    book_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

# Cart Schemas
class CartItemCreate(BaseModel):
    book_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)

class CartItemResponse(BaseModel):
    id: int
    book: BookResponse
    quantity: int
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    total_items: int

# Order Schemas
class OrderItemResponse(BaseModel):
    id: int
    book: BookResponse
    quantity: int
    unit_price: float
    total_price: float
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    shipping_address: str
    payment_method: str
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    subtotal: float
    discount_amount: float
    shipping_fee: float
    total_amount: float
    status: str
    payment_status: str
    shipping_address: str
    payment_method: Optional[str]
    notes: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

class OrderPaymentUpdate(BaseModel):
    payment_status: str

# Wishlist Schemas
class WishlistResponse(BaseModel):
    items: List[BookResponse]
    total_items: int

# Search Schemas
class SearchParams(BaseModel):
    query: Optional[str] = None
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    page: int = 1
    per_page: int = 20

class SearchResponse(BaseModel):
    items: List[BookResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

# Admin Schemas
class DashboardStats(BaseModel):
    total_users: int
    total_orders: int
    total_revenue: float
    total_books: int
    pending_orders: int
    low_stock_items: int