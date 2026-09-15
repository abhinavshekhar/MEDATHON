import { AiRadiologyPanel } from "@/components/modules/ai-radiology-panel";
import { PageHeader } from "@/components/ui/page-header";

export default function AiRadiologyPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
      <PageHeader
        title="AI Radiology"
        description="Chest X-ray analysis with DenseNet121 Grad-CAM heatmap — powered by FastAPI"
      />
      <AiRadiologyPanel />
    </div>
  );
}
