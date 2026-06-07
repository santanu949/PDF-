import os

backend_app_path = r"c:\Users\saanu\Downloads\pdf\PdfKit_backend-main\PdfKit_backend-main\backend\app"

for root, _, files in os.walk(backend_app_path):
    for file in files:
        if file.endswith(".py"):
            filepath = os.path.join(root, file)
            # Skip the new storage module files themselves to be safe
            if "services\\storage" in filepath or "services/storage" in filepath:
                continue
                
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "app.services.cloudinary_storage" in content:
                print(f"Updating {filepath}")
                new_content = content.replace("app.services.cloudinary_storage", "app.services.storage")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)

# Delete old cloudinary_storage.py
old_file = os.path.join(backend_app_path, "services", "cloudinary_storage.py")
if os.path.exists(old_file):
    os.remove(old_file)
    print(f"Deleted old file: {old_file}")
