import requests
import time
import random

BASE_URL = "http://localhost:8000/api/v1"

# Generate random email to avoid duplicate errors
email = f"test{random.randint(1000, 99999)}@example.com"
password = "password123"

# 1. Register
print("\n--- Test: Register ---")
reg_data = {"email": email, "password": password}
r1 = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
print(f"Register Status: {r1.status_code}")
print(f"Register Body: {r1.text}")

# 2. Login
print("\n--- Test: Login ---")
login_data = {"email": email, "password": password}
r2 = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Login Status: {r2.status_code}")
print(f"Login Body: {r2.text}")

if r2.status_code != 200:
    exit(1)
token = r2.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# 3. Upload PDF
print("\n--- Test: Upload PDF ---")
files = {'file': open('test1.pdf', 'rb')}
r3 = requests.post(f"{BASE_URL}/files/upload", headers=headers, files=files)
print(f"Upload Status: {r3.status_code}")
print(f"Upload Body: {r3.text}")
if r3.status_code != 200:
    exit(1)
file_id = r3.json()["file_id"]

def poll_job(job_id):
    print(f"\n--- Polling Job {job_id} ---")
    while True:
        r_status = requests.get(f"{BASE_URL}/jobs/{job_id}/status", headers=headers)
        if r_status.status_code != 200:
            print(f"Error checking status: {r_status.text}")
            break
        
        status = r_status.json().get("status")
        print(f"Job Status: {status} ...")
        
        if status in ["completed", "failed"]:
            break
        time.sleep(2)

# 4. Compress PDF
print("\n--- Test: Compress PDF ---")
compress_data = {"file_id": file_id, "compression_percent": 50}
rc = requests.post(f"{BASE_URL}/tools/compress-pdf", headers=headers, json=compress_data)
print(f"Compress Status: {rc.status_code}")
print(f"Compress Body: {rc.text}")
if rc.status_code == 200:
    job_id = rc.json()["job_id"]
    poll_job(job_id)

# 5. OCR PDF
print("\n--- Test: OCR PDF ---")
ocr_data = {"file_id": file_id, "language": "eng"}
ro = requests.post(f"{BASE_URL}/tools/ocr", headers=headers, json=ocr_data)
print(f"OCR Status: {ro.status_code}")
print(f"OCR Body: {ro.text}")
if ro.status_code == 200:
    job_id = ro.json()["job_id"]
    poll_job(job_id)

# 6. AI Summarize
print("\n--- Test: AI Summarize ---")
ai_data = {"file_id": file_id}
ra = requests.post(f"{BASE_URL}/ai-summarise/", headers=headers, json=ai_data)
print(f"AI Summarize Status: {ra.status_code}")
print(f"AI Summarize Body: {ra.text}")
if ra.status_code == 200:
    job_id = ra.json()["job_id"]
    poll_job(job_id)

print("\n--- Tests Complete ---")
