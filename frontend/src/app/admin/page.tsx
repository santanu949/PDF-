"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return <div style={{ color: "var(--muted)" }}>Loading stats...</div>;
  }

  return (
    <div>
      <div className="tools-header">
        <div className="tools-section-num">Overview</div>
        <h1 className="tools-section-title">Admin Dashboard</h1>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 className="options-panel-title" style={{ background: "transparent", padding: "0 0 12px", border: "none", fontSize: "16px" }}>Platform Statistics</h3>
        <div className="stats-bar" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
          <div className="stat-cell">
            <div className="stat-info">
              <div className="stat-num">{stats.total_users}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-info">
              <div className="stat-num">{stats.total_files}</div>
              <div className="stat-label">Total Files Processed</div>
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-info">
              <div className="stat-num">{stats.total_jobs}</div>
              <div className="stat-label">Total Jobs</div>
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-info">
              <div className="stat-num">{stats.completed_jobs}</div>
              <div className="stat-label">Completed Jobs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-bar" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
        <div className="stat-cell">
          <div className="stat-info">
            <div className="stat-num">{stats.processing_jobs}</div>
            <div className="stat-label">Currently Processing</div>
          </div>
        </div>
        <div className="stat-cell">
          <div className="stat-info">
            <div className="stat-num">{stats.queued_jobs}</div>
            <div className="stat-label">Jobs in Queue</div>
          </div>
        </div>
        <div className="stat-cell">
          <div className="stat-info">
            <div className="stat-num">{stats.failed_jobs}</div>
            <div className="stat-label">Failed Jobs</div>
          </div>
        </div>
        <div className="stat-cell" style={{ visibility: "hidden" }}></div>
      </div>
    </div>
  );
}
