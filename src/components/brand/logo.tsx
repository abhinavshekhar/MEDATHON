import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "light" | "dark" | "color";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: "h-8 w-8", title: "text-sm", tag: "text-[9px]" },
  md: { mark: "h-10 w-10", title: "text-base", tag: "text-[10px]" },
  lg: { mark: "h-12 w-12", title: "text-lg", tag: "text-[11px]" },
};

export function Logo({ className, variant = "color", showTagline = true, size = "md" }: LogoProps) {
  const s = sizes[size];
  const titleClass =
    variant === "light" ? "text-white" : variant === "dark" ? "text-slate-900" : "text-slate-900";
  const tagClass = variant === "light" ? "text-slate-400" : "text-slate-500";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl shadow-lg",
          s.mark,
          variant === "light"
            ? "bg-white/10 ring-1 ring-white/20"
            : "bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/25"
        )}
      >
        <svg viewBox="0 0 32 32" className="h-[55%] w-[55%]" fill="none" aria-hidden>
          <path
            d="M16 6v20M10 12h12M10 20h12"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className={cn("font-bold tracking-tight", s.title, titleClass)}>
          <span className="text-brand-500">Medi</span>Kiosk
        </p>
        {showTagline && (
          <p className={cn("font-medium uppercase tracking-[0.14em]", s.tag, tagClass)}>
            AI Clinical Intake
          </p>
        )}
      </div>
    </div>
  );
}
