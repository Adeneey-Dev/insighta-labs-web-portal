export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const loginUrl = apiUrl.replace("/api", "") + "/api/auth/github";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
      }}
    >
      <div
        style={{
          background: "#1e1e3a",
          padding: "48px",
          borderRadius: "16px",
          textAlign: "center",
          border: "1px solid #2a2a4a",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔬</div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "8px",
            color: "white",
          }}
        >
          Insighta Labs+
        </h1>
        <p
          style={{
            color: "#8888aa",
            marginBottom: "32px",
            fontSize: "16px",
          }}
        >
          Demographic Intelligence Platform
        </p>

        <a
          href={loginUrl}
          style={{
            background: "#ffffff",
            color: "#000000",
            padding: "12px 32px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <span>&#128279;</span>
          Continue with GitHub
        </a>

        <p
          style={{
            color: "#555577",
            fontSize: "12px",
            marginTop: "24px",
          }}
        >
          Secure login powered by GitHub OAuth
        </p>
      </div>
    </main>
  );
}
