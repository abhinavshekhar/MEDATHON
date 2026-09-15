export const metadata = {
  title: "MEDATHON Patient App",
  description: "Self registration, ABDM card, vitals and appointments",
};

export default function PatientAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-brand-50/30">
      <div className="mx-auto min-h-screen max-w-md border-x border-slate-200/80 bg-white shadow-xl">{children}</div>
    </div>
  );
}
