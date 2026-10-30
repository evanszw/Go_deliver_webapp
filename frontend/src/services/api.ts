const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request<T = any>(
  method: string,
  path: string,
  body?: any
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const options: RequestInit = { method, headers, credentials: "include" };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export const api = {
  get: <T = any>(path: string) => request<T>("GET", path),
  post: <T = any>(path: string, body?: any) => request<T>("POST", path, body),
  patch: <T = any>(path: string, body?: any) => request<T>("PATCH", path, body),
};
