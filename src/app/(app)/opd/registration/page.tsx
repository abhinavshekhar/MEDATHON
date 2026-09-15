import { PatientRegistrationForm } from "@/components/patients/patient-registration-form";
import { PageHeader } from "@/components/ui/page-header";

export default function PatientRegistrationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <PageHeader
        title="Patient Registration"
        description="Register a new OPD patient in 3 simple steps"
      />
      <PatientRegistrationForm />
    </div>
  );
}
