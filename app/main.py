import cloudinary
from fastapi import FastAPI
from app.admin.setup import setup_admin
from app.core.configs import settings
from app.api.endpoints import (
    abandoned_pets,
    adoptions,
    auth,
    bookings,
    orders,
    products,
    services,
    users,
)

app = FastAPI(
    title="Pet Care System",
    description="Hệ thống chăm sóc thú cưng",
    version="1.0.0",
)

setup_admin(app)

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(adoptions.router, prefix="/adoptions", tags=["Adoptions"])
app.include_router(
    abandoned_pets.router,
    prefix="/abandoned-pets",
    tags=["Abandoned Pets"],
)


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "Welcome to the Pet Care System! Chào mừng đến với hệ thống chăm sóc thú cưng!",
    }
