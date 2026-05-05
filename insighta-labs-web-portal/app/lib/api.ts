const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const method = options.method || "GET";
  const headers: Record<string, string> = {
    "X-API-Version": "1",
    ...(options.headers as Record<string, string>),
  };

  // For non‑GET requests, add CSRF token from cookie
  if (method !== "GET" && method !== "HEAD") {
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // send cookies
  });

  if (!response.ok) {
    // Try to parse error message from response
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = (await response.text()) || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // For 204 No Content
  if (response.status === 204) return undefined as T;
  return response.json();
}
