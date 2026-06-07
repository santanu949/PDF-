"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.plan_type !== "admin") {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.plan_type !== "admin") {
    return (
      <div className="container" style={{ padding: "80px", textAlign: "center" }}>
        Loading admin panel...
      </div>
    );
  }

  const links = [
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Jobs", href: "/admin/jobs" },
    { label: "Files", href: "/admin/files" },
  ];

  return (
    <div className="tools-page">
      <div className="tools-sidebar">
        <div className="tools-sidebar-section">
          <div className="sidebar-label">Admin Panel</div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${
                pathname === link.href ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="tools-content">{children}</div>
    </div>
  );
}
