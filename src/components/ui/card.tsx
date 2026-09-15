import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-medathon-border bg-white shadow-card", className)}>
      {(title || description) && (
        <div className="border-b border-slate-100 px-6 py-4">
          {title && <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h2>}
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
