import requests

from pathlib import Path

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)


def download_file(url: str):

    print("URL:", url)

    filename = url.split("/")[-1]

    local_path = TEMP_DIR / filename

    from app.core.config import settings
    import shutil
    
    if settings.STORAGE_PROVIDER.lower() == "local" and url.startswith(settings.LOCAL_STORAGE_URL):
        source_path = Path("uploads") / filename
        if source_path.exists():
            shutil.copy2(source_path, local_path)
            return str(local_path)

    # For cloudinary or external URLs
    response = requests.get(url)

    print("STATUS:", response.status_code)

    response.raise_for_status()

    with open(local_path, "wb") as f:
        f.write(response.content)

    print("SAVED:", local_path)

    return str(local_path)