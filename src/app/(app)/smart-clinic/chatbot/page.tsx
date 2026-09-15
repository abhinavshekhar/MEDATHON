import { AiChatbotPanel } from "@/components/modules/ai-chatbot-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";

export default function ClinicalAssistantPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <PageHeader
        title="Clinical Assistant"
        description="Instant Q&A powered by Gemini AI — vitals, triage, workflow, and patient context"
        action={<Badge variant="info">Smart Clinic</Badge>}
      />
      <AiChatbotPanel />
      <p className="text-center text-xs text-slate-500">
        Add <code className="rounded bg-slate-100 px-1">GEMINI_API_KEY</code> to{" "}
        <code className="rounded bg-slate-100 px-1">.env</code> for live AI. Get a free key at{" "}
        <a href="https://aistudio.google.com/apikey" className="text-brand-700 underline" target="_blank" rel="noreferrer">
          Google AI Studio
        </a>
        .
      </p>
    </div>
  );
}
