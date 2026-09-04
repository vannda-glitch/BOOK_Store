from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.router import api_router
from .database import engine, Base
from .models import User, UserRole
from .auth import get_password_hash
from .config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Book Store API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
def create_admin():
    from .database import SessionLocal
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.ADMIN_EMAIL,
                username="admin",
                full_name="System Admin",
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(admin)
            db.commit()
            print(f"✅ Admin user created: {settings.ADMIN_EMAIL}")
        else:
            print(f"✅ Admin user already exists: {settings.ADMIN_EMAIL}")
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Book Store API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}