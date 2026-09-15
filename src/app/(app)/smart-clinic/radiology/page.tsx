import { AiRadiologyPanel } from "@/components/modules/ai-radiology-panel";
import { PageHeader } from "@/components/ui/page-header";

export default function AiRadiologyPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
      <PageHeader
        title="AI Radiology"
        description="Chest X-ray analysis with Gemini Vision ML — assistive interpretation only"
      />
      <AiRadiologyPanel />
    </div>
  );
}
