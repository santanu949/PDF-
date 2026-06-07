FROM python:3.13-slim

WORKDIR /app

# Install system dependencies required for PDF, OCR, and Document conversions
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    ghostscript \
    libreoffice \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (context must be PdfKit_backend-main root)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY . ./backend/
WORKDIR /app/backend

# Set default command (will be overridden by docker-compose for celery worker)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "app"]
