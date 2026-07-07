import cloudinary
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.configs import settings
from app.api.endpoints import services, products, rescuepets

app = FastAPI(
    title="Pet Care System",
    description="Hệ thống chăm sóc thú cưng",
    version="1.0.0",
)

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(rescuepets.router, prefix="/rescue-pets", tags=["Rescue Pets"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Pet Care System! Chào mừng đến với hệ thống chăm sóc thú cưng!"}