from app.core.config import settings
from app.services.storage.base import StorageProvider
from app.services.storage.local_storage import LocalStorageProvider
from app.services.storage.cloudinary_storage import CloudinaryStorageProvider

def get_storage_provider() -> StorageProvider:
    if settings.STORAGE_PROVIDER.lower() == "cloudinary":
        return CloudinaryStorageProvider()
    return LocalStorageProvider()

provider = get_storage_provider()

def upload_file(file_path: str) -> str:
    """Convenience function to match the previous signature."""
    return provider.upload_file(file_path)
