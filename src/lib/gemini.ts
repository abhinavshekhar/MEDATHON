import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-3.6-flash";

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function getGeminiModel(modelName?: string): GenerativeModel | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: modelName ?? process.env.GEMINI_MODEL?.trim() ?? DEFAULT_MODEL,
  });
}

export function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export function parseImageInput(input: {
  image_base64?: string;
  image_data_url?: string;
  mime_type?: string;
}): { mimeType: string; data: string } | null {
  if (input.image_data_url) {
    const parsed = parseDataUrl(input.image_data_url);
    if (parsed) return parsed;
  }
  if (input.image_base64) {
    const raw = input.image_base64.includes(",")
      ? input.image_base64.split(",").pop()!
      : input.image_base64;
    return {
      mimeType: input.mime_type ?? "image/jpeg",
      data: raw,
    };
  }
  return null;
}

export function extractJsonFromText(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? text).trim();
  try {
    return JSON.parse(candidate) as Record<string, unknown>;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}
