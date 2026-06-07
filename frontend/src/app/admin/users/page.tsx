"use client";

import { useEffect, useState } from "react";
import { getAdminUsers } from "@/lib/adminApi";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "var(--muted)" }}>Loading users...</div>;
  }

  return (
    <div>
      <div className="tools-header">
        <div className="tools-section-num">Users</div>
        <h1 className="tools-section-title">Manage Users</h1>
      </div>

      <div className="files-panel">
        <div className="file-list">
          <div className="file-row" style={{ background: "var(--bg-3)" }}>
            <div className="file-row-num" style={{ width: "40px" }}>ID</div>
            <div className="file-row-info">
              <div className="file-row-name">Email Address</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Role</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Joined</div>
            </div>
          </div>
          {users.map((u) => (
            <div className="file-row" key={u.id}>
              <div className="file-row-num" style={{ width: "40px" }}>{u.id}</div>
              <div className="file-row-info">
                <div className="file-row-name">{u.email}</div>
              </div>
              <div className="file-row-info" style={{ flex: "0.5" }}>
                <div className="file-row-name">
                  <span className={u.plan_type === "admin" ? "detect-badge" : "detect-badge"} style={{ background: u.plan_type === "admin" ? "var(--text)" : "var(--bg-4)", color: u.plan_type === "admin" ? "var(--bg)" : "var(--text)", marginLeft: 0 }}>
                    {u.plan_type}
                  </span>
                </div>
              </div>
              <div className="file-row-info" style={{ flex: "0.5" }}>
                <div className="file-row-meta">
                  {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="file-row">
              <div className="file-row-info">
                <div className="file-row-meta">No users found.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
