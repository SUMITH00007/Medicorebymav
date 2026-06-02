import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Medicore API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "SUPER_SECRET_SECURITY_KEY_FOR_JWT_GENERATION_MEDICORE")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days token duration for trial convenience
    
    # Fallback to local SQLite if POSTGRES_URL is not specified to make the application immediately runnable
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./medicore.db"
    )

    class Config:
        case_sensitive = True

settings = Settings()
