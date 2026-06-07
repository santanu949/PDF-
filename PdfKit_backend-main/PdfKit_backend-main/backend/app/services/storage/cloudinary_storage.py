import cloudinary
import cloudinary.uploader
from app.services.storage.base import StorageProvider
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

class CloudinaryStorageProvider(StorageProvider):
    def upload_file(self, file_path: str) -> str:
        result = cloudinary.uploader.upload(
            file_path,
            resource_type="raw",
        )
        print("cld result:")
        print(result)
        return result["secure_url"]
