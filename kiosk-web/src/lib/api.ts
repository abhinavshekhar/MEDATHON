import { KIOSK_CONFIG } from "./config";

/** Main MEDATHON HIMS backend (separate website). */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const fromStorage =
    typeof window !== "undefined"
      ? localStorage.getItem("medathon_api_base_url")?.replace(/\/$/, "")
      : "";
  if (fromStorage) return fromStorage;

  return "https://medathon-ten.vercel.app";
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export function mainAppUrl(path = ""): string {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function digitalTwinUrl(patientId?: string) {
  const q = patientId ? `?patient=${encodeURIComponent(patientId)}` : "";
  return mainAppUrl(`/smart-clinic/digital-twin${q}`);
}
