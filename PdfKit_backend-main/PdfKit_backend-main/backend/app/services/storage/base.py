from abc import ABC, abstractmethod

class StorageProvider(ABC):
    @abstractmethod
    def upload_file(self, file_path: str) -> str:
        """
        Uploads a file and returns its public or accessible URL.
        """
        pass
