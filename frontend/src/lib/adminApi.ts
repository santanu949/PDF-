import { api } from "./api";

// ─── Admin Dashboard Stats ──────────────────────────────────
// Backend: GET /admin/stats
export async function getAdminStats() {
  const response = await api.get("/api/v1/admin/stats");
  return response.data; // { total_users, total_files, total_jobs, completed_jobs, failed_jobs, processing_jobs, queued_jobs }
}

// ─── Admin Jobs ─────────────────────────────────────────────
// Backend: GET /admin/jobs
export async function getAdminJobs() {
  const response = await api.get("/api/v1/admin/jobs");
  return response.data; // list of Job objects
}

// ─── Admin Files ────────────────────────────────────────────
// Backend: GET /admin/files
export async function getAdminFiles() {
  const response = await api.get("/api/v1/admin/files");
  return response.data; // list of File objects
}

// ─── Admin Users ────────────────────────────────────────────
// Backend: GET /admin/users
export async function getAdminUsers() {
  const response = await api.get("/api/v1/admin/users");
  return response.data; // list of User objects
}
