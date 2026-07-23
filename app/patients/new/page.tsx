"use client";

import { AssessmentWizard } from "@/components/assessments/assessment-wizard";
import { ClipboardList } from "lucide-react";

export default function NewPatientPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">New Patient Intake</h1>
      </div>
      <AssessmentWizard mode="new" />
    </div>
  );
}
