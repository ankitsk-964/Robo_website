const BASE = import.meta.env.VITE_API_BASE || "";

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function apiPost(path, body) {
  const base = import.meta.env.VITE_API_BASE ?? "";
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",   // ← this line is critical
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE}${path}`, {
    method:      "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method:      "PATCH",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
    body:         JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}