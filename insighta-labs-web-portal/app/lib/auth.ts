export function getAccessToken(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("access_token") || "";
  }
  return "";
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-API-Version": "1",
  };
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export function logout(): void {
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
}
