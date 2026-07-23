"use client";

import { AssessmentWizard } from "@/components/assessments/assessment-wizard";

export default function NewPatientPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Patient Intake</h1>
      <AssessmentWizard mode="new" />
    </div>
  );
}
