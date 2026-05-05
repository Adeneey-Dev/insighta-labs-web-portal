"use client";
import { useState } from "react";
import Link from "next/link";
import { apiCall } from "../lib/api";
import { isLoggedIn } from "../lib/auth";

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  age_group: string;
  country_name: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const examples = [
    "young males from nigeria",
    "females above 30",
    "adult males from kenya",
    "teenagers from ghana",
    "seniors from ethiopia",
  ];

  const search = async (q?: string) => {
    if (!(await isLoggedIn())) {
      window.location.href = "/";
      return;
    }
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await apiCall<any>(
        `/profiles/search?q=${encodeURIComponent(searchQuery)}`,
      );
      setResults(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err: any) {
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700" }}>
            Natural Language Search
          </h1>
          <p style={{ color: "#8888aa", fontSize: "14px" }}>
            Search profiles in plain English
          </p>
        </div>
        <Link href="/dashboard" style={{ color: "#8888aa", fontSize: "14px" }}>
          ← Dashboard
        </Link>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="e.g. young males from nigeria"
          style={{
            flex: 1,
            background: "#1e1e3a",
            border: "1px solid #2a2a4a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            outline: "none",
          }}
        />
        <button
          onClick={() => search()}
          style={{
            background: "#7c7cff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Search
        </button>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "#8888aa", fontSize: "13px", marginBottom: "8px" }}>
          Try these examples:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex);
                search(ex);
              }}
              style={{
                background: "#1e1e3a",
                color: "#8888aa",
                border: "1px solid #2a2a4a",
                padding: "6px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#ff444422",
            border: "1px solid #ff4444",
            color: "#ff4444",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}
      {loading && (
        <p style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
          Searching...
        </p>
      )}
      {!loading && searched && results.length === 0 && !error && (
        <p style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
          No results found
        </p>
      )}
      {!loading && results.length > 0 && (
        <>
          <p
            style={{ color: "#8888aa", fontSize: "14px", marginBottom: "16px" }}
          >
            Found {total} results
          </p>
          <div
            style={{
              background: "#1e1e3a",
              borderRadius: "12px",
              border: "1px solid #2a2a4a",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#16163a" }}>
                  {["Name", "Gender", "Age", "Age Group", "Country"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          color: "#8888aa",
                          fontSize: "13px",
                          borderBottom: "1px solid #2a2a4a",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ background: i % 2 === 0 ? "#1e1e3a" : "#1a1a36" }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {p.name}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                      <span
                        style={{
                          background:
                            p.gender === "male" ? "#4488ff22" : "#ff44aa22",
                          color: p.gender === "male" ? "#4488ff" : "#ff44aa",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {p.gender}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                      {p.age}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#8888aa",
                      }}
                    >
                      {p.age_group}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                      {p.country_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
