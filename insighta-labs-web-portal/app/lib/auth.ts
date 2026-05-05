// lib/auth.ts
import { apiCall } from "./api";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: string;
}

export async function getUser(): Promise<User | null> {
  try {
    const res = await apiCall<{ data: User }>("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

export async function logout(): Promise<void> {
  await apiCall("/auth/logout", { method: "POST" });
  // Force redirect to home
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
