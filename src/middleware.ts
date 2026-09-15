import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://medathon-kiosk.vercel.app",
  process.env.KIOSK_WEB_URL,
  process.env.NEXT_PUBLIC_KIOSK_URL,
].filter(Boolean) as string[];

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (DEFAULT_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/medathon-kiosk[a-z0-9-]*\.vercel\.app$/i.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+-abhinavshekharofficial-1386s-projects\.vercel\.app$/i.test(origin) && origin.includes("kiosk")) {
    return true;
  }
  return false;
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    if (origin && isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
    }
    return new NextResponse(null, { status: 204 });
  }

  const response = NextResponse.next();
  if (origin && isAllowedOrigin(origin)) {
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
