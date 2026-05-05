"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, User } from "../lib/auth";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await getUser();
        if (!userData) throw new Error();
        setUser(userData);
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <p style={{ color: "#8888aa" }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>My Account</h1>
        <Link href="/dashboard" style={{ color: "#8888aa", fontSize: "14px" }}>
          ← Dashboard
        </Link>
      </div>
      <div
        style={{
          background: "#1e1e3a",
          borderRadius: "16px",
          border: "1px solid #2a2a4a",
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid #7c7cff",
              }}
            />
          ) : (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#7c7cff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "700",
              }}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "700" }}>
              @{user.username}
            </h2>
            <span
              style={{
                background: user.role === "admin" ? "#ff6b6b22" : "#00d4aa22",
                color: user.role === "admin" ? "#ff6b6b" : "#00d4aa",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {user.role}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "User ID", value: user.id },
            { label: "Username", value: user.username },
            { label: "Email", value: user.email || "Not provided" },
            { label: "Role", value: user.role },
            {
              label: "Access Level",
              value:
                user.role === "admin"
                  ? "Full Access (read + write)"
                  : "Read Only",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #2a2a4a",
              }}
            >
              <span style={{ color: "#8888aa", fontSize: "14px" }}>
                {item.label}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  maxWidth: "60%",
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
