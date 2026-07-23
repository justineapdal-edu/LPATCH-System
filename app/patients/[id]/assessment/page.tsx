"use client";

import { AssessmentWizard } from "@/components/assessments/assessment-wizard";

export default function ReAssessmentPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Assessment</h1>
      <AssessmentWizard mode="reassessment" patientId="dynamic-patient-id" />
    </div>
  );
}
