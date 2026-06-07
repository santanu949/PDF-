"use client";

import { useEffect, useState } from "react";
import { getAdminFiles } from "@/lib/adminApi";

export default function AdminFiles() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminFiles()
      .then((data) => {
        setFiles(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "var(--muted)" }}>Loading files...</div>;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="tools-header">
        <div className="tools-section-num">Files</div>
        <h1 className="tools-section-title">Uploaded Files</h1>
      </div>

      <div className="files-panel">
        <div className="file-list">
          <div className="file-row" style={{ background: "var(--bg-3)" }}>
            <div className="file-row-num" style={{ width: "40px" }}>ID</div>
            <div className="file-row-info">
              <div className="file-row-name">Filename</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Size</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Type</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">User ID</div>
            </div>
            <div className="file-row-info" style={{ flex: "0.5" }}>
              <div className="file-row-name">Date</div>
            </div>
          </div>
          {files.map((f) => (
            <div className="file-row" key={f.id}>
              <div className="file-row-num" style={{ width: "40px" }}>{f.id}</div>
              <div className="file-row-info">
                <div className="file-row-name" title={f.original_filename}>{f.original_filename}</div>
              </div>
              <div className="file-row-info" style={{ flex: "0.5" }}>
                <div className="file-row-meta">{formatBytes(f.size_bytes)}</div>
              </div>
              <div className="file-row-info" style={{ flex: "0.5" }}>
                <div className="file-row-meta">{f.mime_type?.split("/").pop() || "unknown"}</div>
              </div>
              <div className="file-row-info" style={{ flex: "0.5" }}>
                <div className="file-row-meta">{f.user_id}</div>
              </div>
              <div className="file-row-info" style={{ flex: "0.5" }}>
                <div className="file-row-meta">
                  {new Date(f.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <div className="file-row">
              <div className="file-row-info">
                <div className="file-row-meta">No files found.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
