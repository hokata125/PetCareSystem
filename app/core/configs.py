from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    SEPAY_ACC: str
    SEPAY_BANK: str
    SEPAY_QR_BASE: str
    SEPAY_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()