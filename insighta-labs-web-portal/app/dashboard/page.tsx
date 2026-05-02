import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <p style={{ color: "#8888aa" }}>Loading dashboard...</p>
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
