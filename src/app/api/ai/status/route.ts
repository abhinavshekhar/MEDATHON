import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    gemini: isGeminiConfigured(),
    model: process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash",
    mlFallback: true,
  });
}
