import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    visit_id: body.visit_id,
    status: "pending",
    message: "NLP summary not yet implemented — wire Ollama here",
    summary: null,
  });
}
