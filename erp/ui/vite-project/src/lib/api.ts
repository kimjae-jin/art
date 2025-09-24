export const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://127.0.0.1:8000";

async function handle(res: Response) {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export async function apiGet(path: string) {
  const r = await fetch(API_BASE + path, { credentials: "omit" });
  return handle(r);
}

export async function apiPost(path: string, data: any) {
  const r = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "omit",
  });
  return handle(r);
}
