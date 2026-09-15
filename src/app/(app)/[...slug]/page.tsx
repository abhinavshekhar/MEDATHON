import { ModulePage } from "@/components/modules/module-page";
import { getModuleConfig, getModulePath } from "@/lib/module-config";
import { notFound } from "next/navigation";

export default function ModuleRoutePage({ params }: { params: { slug: string[] } }) {
  const path = getModulePath(params.slug);
  const config = getModuleConfig(path);
  if (!config) notFound();
  return <ModulePage config={config} />;
}
