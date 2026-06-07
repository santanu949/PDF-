import requests
import time
import os
import json

BASE_URL = "http://localhost:8000/api/v1"

# Create two minimal valid PDFs
pdf_content = b"%PDF-1.4\n1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R>> endobj\n4 0 obj <</Length 21>> stream\nBT /F1 24 Tf 100 700 Td (Hello World) Tj ET\nendstream endobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000203 00000 n \ntrailer <</Size 5 /Root 1 0 R>>\nstartxref\n275\n%%EOF\n"
with open("test1.pdf", "wb") as f: f.write(pdf_content)
with open("test2.pdf", "wb") as f: f.write(pdf_content)

print("--- Test 1: Register ---")
# Use timestamp to avoid existing user issues
user_email = f"test{int(time.time())}@example.com"
reg_data = {"email": user_email, "password": "password123", "username": f"user{int(time.time())}"}
r1 = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
print("Register Status:", r1.status_code)
print("Register Body:", r1.text)

print("\n--- Test 2: Login ---")
login_data = {"email": user_email, "password": "password123"}
r2 = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print("Login Status:", r2.status_code)
print("Login Body:", r2.text)
if r2.status_code != 200:
    print("Login failed, aborting tests.")
    exit(1)

token = r2.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

print("\n--- Test 3: Upload PDF ---")
# Upload first PDF
with open("test1.pdf", "rb") as f:
    files = {"file": ("test1.pdf", f, "application/pdf")}
    r3a = requests.post(f"{BASE_URL}/files/upload", headers=headers, files=files)
print("Upload 1 Status:", r3a.status_code)
print("Upload 1 Body:", r3a.text)
file1_id = r3a.json().get("file_id", r3a.json().get("id"))

# Upload second PDF
with open("test2.pdf", "rb") as f:
    files = {"file": ("test2.pdf", f, "application/pdf")}
    r3b = requests.post(f"{BASE_URL}/files/upload", headers=headers, files=files)
print("Upload 2 Status:", r3b.status_code)
print("Upload 2 Body:", r3b.text)
file2_id = r3b.json().get("file_id", r3b.json().get("id"))

if not file1_id or not file2_id:
    print("Upload failed, aborting.")
    exit(1)

print("\n--- Test 4: Merge PDF ---")
merge_data = {"file_ids": [file1_id, file2_id]}
r4 = requests.post(f"{BASE_URL}/merge/", headers=headers, json=merge_data)
print("Merge Status:", r4.status_code)
print("Merge Body:", r4.text)
job_id = r4.json().get("job_id", r4.json().get("id"))

if not job_id:
    print("Merge job creation failed, aborting.")
    exit(1)

print(f"\n--- Polling Job {job_id} ---")
status = "pending"
for _ in range(15):
    r_status = requests.get(f"{BASE_URL}/jobs/{job_id}/status", headers=headers)
    resp = r_status.json()
    status = resp.get("status")
    print(f"Job Status: {status} ...")
    if status in ["completed", "failed"]:
        break
    time.sleep(2)

print("\n--- Test 5: Download Result ---")
if status == "completed":
    r_down = requests.get(f"{BASE_URL}/jobs/{job_id}/download", headers=headers)
    print("Download Status:", r_down.status_code)
    print("Content-Disposition:", r_down.headers.get("content-disposition"))
    with open("merged_result.pdf", "wb") as f:
        f.write(r_down.content)
    print("Successfully downloaded merged_result.pdf, size:", len(r_down.content))
else:
    print(f"Job finished with status {status}, cannot download.")
