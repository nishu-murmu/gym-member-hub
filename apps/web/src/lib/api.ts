import type { DashboardStats, Member } from "@/types/gym";

const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  getMembers: () => request<Member[]>("/members"),
  createMember: (data: Partial<Member>) =>
    request<Member>("/members", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        branch: data.branch,
        plan: data.plan,
        subscriptionStart: data.subscriptionStart,
        subscriptionEnd: data.subscriptionEnd,
      }),
    }),
  updateMember: (id: string, data: Partial<Member>) =>
    request<Member>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        branch: data.branch,
        plan: data.plan,
        subscriptionStart: data.subscriptionStart,
        subscriptionEnd: data.subscriptionEnd,
      }),
    }),
  deleteMember: (id: string) =>
    request<void>(`/members/${id}`, { method: "DELETE" }),
  getDashboardStats: () => request<DashboardStats>("/stats/dashboard"),
};

