import os
import shutil
import uuid
from app.services.storage.base import StorageProvider
from app.core.config import settings

class LocalStorageProvider(StorageProvider):
    def __init__(self):
        self.upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(self.upload_dir, exist_ok=True)
        
    def upload_file(self, file_path: str) -> str:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        _, ext = os.path.splitext(file_path)
        new_filename = f"{uuid.uuid4().hex}{ext}"
        destination = os.path.join(self.upload_dir, new_filename)
        
        shutil.copy2(file_path, destination)
        
        # Return URL to access this file
        return f"{settings.LOCAL_STORAGE_URL}/{new_filename}"
