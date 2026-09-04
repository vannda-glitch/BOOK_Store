from fastapi import APIRouter
from .endpoints import (
    auth, users, books, categories, authors, publishers,
    cart, orders, wishlist, reviews, admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(books.router, prefix="/books", tags=["Books"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(authors.router, prefix="/authors", tags=["Authors"])
api_router.include_router(publishers.router, prefix="/publishers", tags=["Publishers"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])