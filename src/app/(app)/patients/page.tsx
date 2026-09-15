import { Suspense } from "react";
import PatientRecordsContent from "./patient-records-content";

export default function PatientsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-400">Loading…</div>}>
      <PatientRecordsContent />
    </Suspense>
  );
}
