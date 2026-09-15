/** Resolve AI API base URL — defaults to same origin on Vercel production. */
export function getAiApiUrl() {
  const configured = process.env.NEXT_PUBLIC_AI_API_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}
