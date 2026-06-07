from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GROQ_API_KEY: str
    BASE_URL: str

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str 
    POPPLER_PATH: str | None = None
    GHOSTSCRIPT_PATH: str | None = "gs"
    LIBREOFFICE_PATH: str | None = "libreoffice"
    TESSERACT_PATH: str | None = "tesseract"

    STORAGE_PROVIDER: str = "local"
    LOCAL_STORAGE_URL: str = "http://localhost:8000/uploads"
    class Config:
        env_file = ".env"


settings = Settings()