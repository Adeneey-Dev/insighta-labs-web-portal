"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: string;
}

interface Stats {
  total: number;
}

// Token storage helpers
function saveTokens(access: string, refresh: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
  }
}

function getAccessToken(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("access_token") || "";
  }
  return "";
}

export function getAuthHeaders() {
  const token = getAccessToken();
  return token
    ? { Authorization: `Bearer ${token}`, "X-API-Version": "1" }
    : { "X-API-Version": "1" };
}

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        // Check if tokens came from OAuth redirect
        const tokensParam = searchParams.get("tokens");
        if (tokensParam) {
          const parsed = JSON.parse(decodeURIComponent(tokensParam));
          saveTokens(parsed.access_token, parsed.refresh_token);
          // Clean URL
          window.history.replaceState({}, "", "/dashboard");
        }

        const token = getAccessToken();
        if (!token) {
          window.location.href = "/";
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "X-API-Version": "1",
        };

        const userRes = await axios.get(`${API}/auth/me`, { headers });
        setUser(userRes.data.data);

        const statsRes = await axios.get(`${API}/profiles?limit=1`, {
          headers,
        });
        setStats({ total: statsRes.data.total });
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  const handleLogout = () => {
    const token = getAccessToken();
    axios
      .post(
        `${API}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .finally(() => {
        sessionStorage.clear();
        window.location.href = "/";
      });
  };

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

  return (
    <div style={{ minHeight: "100vh", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          padding: "16px 24px",
          background: "#1e1e3a",
          borderRadius: "12px",
          border: "1px solid #2a2a4a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🔬</span>
          <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
            Insighta Labs+
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt="avatar"
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
          )}
          <span style={{ color: "#8888aa", fontSize: "14px" }}>
            @{user?.username}
          </span>
          <span
            style={{
              background: user?.role === "admin" ? "#ff6b6b22" : "#00d4aa22",
              color: user?.role === "admin" ? "#ff6b6b" : "#00d4aa",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "#ff4444",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total Profiles",
            value: stats?.total ?? 0,
            color: "#00d4aa",
          },
          { label: "Your Role", value: user?.role ?? "-", color: "#7c7cff" },
          { label: "Status", value: "Active", color: "#00d4aa" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#1e1e3a",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #2a2a4a",
            }}
          >
            <p
              style={{
                color: "#8888aa",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: stat.color,
                textTransform: "capitalize",
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          {
            href: "/profiles",
            label: "View Profiles",
            icon: "👥",
            desc: "Browse and filter all profiles",
          },
          {
            href: "/search",
            label: "Search",
            icon: "🔍",
            desc: "Natural language search",
          },
          {
            href: "/account",
            label: "My Account",
            icon: "👤",
            desc: "View your account details",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              style={{
                background: "#1e1e3a",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #2a2a4a",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {item.label}
              </h3>
              <p style={{ color: "#8888aa", fontSize: "14px" }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
