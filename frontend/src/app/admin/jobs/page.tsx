"use client";

import { useEffect, useState } from "react";
import { getAdminJobs } from "@/lib/adminApi";

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminJobs()
      .then((data) => {
        setJobs(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "var(--muted)" }}>Loading jobs...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return { bg: "rgba(74, 124, 89, 0.15)", text: "var(--success)" };
      case "failed": return { bg: "rgba(192, 57, 43, 0.15)", text: "var(--danger)" };
      case "processing": return { bg: "rgba(66, 133, 244, 0.15)", text: "#4285F4" };
      default: return { bg: "var(--bg-4)", text: "var(--muted)" };
    }
  };

  return (
    <div>
      <div className="tools-header">
        <div className="tools-section-num">Jobs</div>
        <h1 className="tools-section-title">Background Tasks</h1>
      </div>

      <div className="files-panel">
        <div className="file-list">
          <div className="file-row" style={{ background: "var(--bg-3)" }}>
            <div className="file-row-num" style={{ width: "40px" }}>ID</div>
            <div className="file-row-info">
              <div className="file-row-name">Tool Name</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Status</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">User ID</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Date</div>
            </div>
          </div>
          {jobs.map((j) => {
            const colors = getStatusColor(j.status);
            return (
              <div className="file-row" key={j.id}>
                <div className="file-row-num" style={{ width: "40px" }}>{j.id}</div>
                <div className="file-row-info">
                  <div className="file-row-name">{j.tool_name}</div>
                  <div className="file-row-meta">Result ID: {j.result_file_id || "N/A"}</div>
                </div>
                <div className="file-row-info" style={{ flex: "0.5" }}>
                  <div className="file-row-name">
                    <span className="detect-badge" style={{ background: colors.bg, color: colors.text, marginLeft: 0 }}>
                      {j.status}
                    </span>
                  </div>
                </div>
                <div className="file-row-info" style={{ flex: "0.5" }}>
                  <div className="file-row-meta">{j.user_id}</div>
                </div>
                <div className="file-row-info" style={{ flex: "0.5" }}>
                  <div className="file-row-meta">
                    {new Date(j.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
          {jobs.length === 0 && (
            <div className="file-row">
              <div className="file-row-info">
                <div className="file-row-meta">No jobs found.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
