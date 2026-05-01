"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const fetchProfiles = async (p = 1) => {
    setLoading(true);
    try {
      const params: any = { page: p, limit: 10, sort_by: sortBy, order };
      if (gender) params.gender = gender;
      if (country) params.country_id = country.toUpperCase();
      if (ageGroup) params.age_group = ageGroup;

      const res = await axios.get(`${API}/profiles`, {
        params,
        withCredentials: true,
        headers: { "X-API-Version": "1" },
      });

      setProfiles(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
      setPage(p);
    } catch {
      window.location.href = "/";
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const inputStyle = {
    background: "#1e1e3a",
    border: "1px solid #2a2a4a",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700" }}>Profiles</h1>
          <p style={{ color: "#8888aa", fontSize: "14px" }}>Total: {total}</p>
        </div>
        <Link href="/dashboard" style={{ color: "#8888aa", fontSize: "14px" }}>
          ← Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#1e1e3a",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #2a2a4a",
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap" as const,
          gap: "12px",
          alignItems: "center",
        }}
      >
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country (e.g. NG)"
          style={{ ...inputStyle, width: "140px" }}
        />

        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Age Groups</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={inputStyle}
        >
          <option value="created_at">Sort: Date</option>
          <option value="age">Sort: Age</option>
          <option value="gender_probability">Sort: Gender Prob</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={inputStyle}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <button
          onClick={() => fetchProfiles(1)}
          style={{
            background: "#7c7cff",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Filter
        </button>

        <button
          onClick={() => {
            setGender("");
            setCountry("");
            setAgeGroup("");
            setSortBy("created_at");
            setOrder("desc");
            setTimeout(() => fetchProfiles(1), 100);
          }}
          style={{
            background: "transparent",
            color: "#8888aa",
            border: "1px solid #2a2a4a",
            padding: "8px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Reset
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
          Loading...
        </p>
      ) : (
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
                {[
                  "Name",
                  "Gender",
                  "Age",
                  "Age Group",
                  "Country",
                  "Country ID",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      color: "#8888aa",
                      fontSize: "13px",
                      fontWeight: "600",
                      borderBottom: "1px solid #2a2a4a",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p, i) => (
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
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#8888aa",
                    }}
                  >
                    {p.country_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <p style={{ color: "#8888aa", fontSize: "14px" }}>
          Page {page} of {totalPages}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => fetchProfiles(page - 1)}
            disabled={page === 1}
            style={{
              background: page === 1 ? "#1e1e3a" : "#2a2a4a",
              color: page === 1 ? "#444466" : "white",
              border: "1px solid #2a2a4a",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            Previous
          </button>
          <button
            onClick={() => fetchProfiles(page + 1)}
            disabled={page === totalPages}
            style={{
              background: page === totalPages ? "#1e1e3a" : "#7c7cff",
              color: page === totalPages ? "#444466" : "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
