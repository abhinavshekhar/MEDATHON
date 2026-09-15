import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPatientName(p: {
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
}) {
  return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");
}

export function generatePatientNo() {
  const n = Date.now().toString(36).toUpperCase();
  return `P-${n.slice(-8)}`;
}

export function generateVisitId() {
  const n = Date.now().toString(36).toUpperCase();
  return `V-${n.slice(-8)}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
