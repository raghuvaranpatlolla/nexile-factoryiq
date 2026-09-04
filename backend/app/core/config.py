import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexile - FactoryIQ Manufacturing Excellence Portal"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "nexile_factoryiq_super_secret_jwt_key_2026_manufacturing_excellence"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days for dev convenience
    
    # Database configuration (SQLite by default for zero-setup local execution)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./factoryiq.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:4200",
        "http://localhost:3000",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:8000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
