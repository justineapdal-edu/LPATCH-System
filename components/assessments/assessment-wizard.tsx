"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { page1Schema, page2Schema, assessmentSchema } from "@/lib/validations/assessment";
import {
  createNewPatientAssessment,
  createReAssessment,
} from "@/lib/actions/create-assessment";
import type { FrequencyDuration, Gender } from "@/types/patient";
import type { AssessmentInput } from "@/lib/validations/assessment";
import { PatientInfoStep } from "./steps/patient-info-step";
import { MedicalHistoryStep } from "./steps/medical-history-step";
import { PhysicalExamStep } from "./steps/physical-exam-step";
import { PresentingComplaintStep } from "./steps/presenting-complaint-step";
import { FunctionalAssessmentStep } from "./steps/functional-assessment-step";
import { AssessmentSummaryStep } from "./steps/assessment-summary-step";
import { TreatmentPlanStep } from "./steps/treatment-plan-step";
import { TherapistNotesStep } from "./steps/therapist-notes-step";

const TOTAL_STEPS = 8;

const stepLabels = [
  "Patient Info",
  "Medical",
  "Exam",
  "Complaint",
  "Function",
  "Summary",
  "Treatment",
  "Notes & Sign",
];

interface AssessmentWizardProps {
  mode: "new" | "reassessment";
  patientId?: string;
  existingPatient?: {
    fullName: string;
    address: string;
    dateOfBirth: string;
    gender: Gender;
    contactNumber: string;
    email: string;
  };
}

const defaultFd: FrequencyDuration = {
  frequency: "3x/week",
  durationMinutes: 45,
  totalWeeks: 8,
  preferredTimeOfDay: "morning",
  startDate: "",
};

function emptyFormData(): AssessmentInput {
  return {
    patientInformation: {
      fullName: "",
      address: "",
      dateOfBirth: "",
      gender: "male",
      contactNumber: "",
      email: "",
      occupation: "",
      hobbies: "",
      dateOfAssessment: new Date().toISOString().split("T")[0],
      referringDoctor: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
    },
    medicalHistory: {
      hypertension: false,
      diabetes: false,
      cardiovascularDisease: false,
      respiratoryConditions: false,
      neurologicalDisorders: false,
      musculoskeletalInjuries: false,
      surgeries: "",
      medications: "",
      allergies: "",
      otherHistory: "",
    },
    physicalExamination: {
      posture: "",
      gait: "",
      rangeOfMotion: "",
      muscleStrength: "",
      jointIntegrity: "",
      neurologicalScreening: "",
      specialTests: "",
    },
    presentingComplaint: {
      description: "",
      onsetDuration: "",
      aggravatingRelievingFactors: "",
      painScale: 5,
      functionalLimitations: "",
    },
    functionalAssessment: {
      adls: "",
      mobilityStatus: "",
      balanceCoordination: "",
      assistiveDevices: "",
      workLimitations: "",
    },
    assessmentSummary: {
      clinicalImpression: "",
      ptDiagnosis: "",
      prognosis: "",
      goals: "",
    },
    treatmentPlan: {
      frequencyDuration: defaultFd,
      modalities: "",
      therapeuticExercises: "",
      manualTherapy: "",
      homeExerciseProgram: "",
      educationCounseling: "",
    },
    therapistNotes: {
      initialResponse: "",
      recommendations: "",
      followUpDate: "",
    },
    therapistOnDuty: {
      name: "",
      licenseNumber: "",
      date: new Date().toISOString().split("T")[0],
      signatureBase64: "",
    },
    notes: "",
  };
}

export function AssessmentWizard({
  mode,
  patientId,
  existingPatient,
}: AssessmentWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentInput>(() => {
    const data = emptyFormData();
    if (existingPatient) {
      data.patientInformation = {
        ...data.patientInformation,
        ...existingPatient,
      };
    }
    return data;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const actionFn =
    mode === "new"
      ? createNewPatientAssessment
      : (input: AssessmentInput) =>
          createReAssessment(patientId!, input);

  type ActionResult =
    | { success: true; patientId: string }
    | { success: false; errors: Record<string, string> };

  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, data: AssessmentInput): Promise<ActionResult> => {
      return actionFn(data);
    },
    null
  );

  function updateData(path: string, value: unknown) {
    setFormData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj: Record<string, unknown> = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function validateStep(step: number): boolean {
    setErrors({});
    let result;
    if (step <= 5) {
      result = page1Schema.safeParse(formData);
    } else {
      result = page2Schema.safeParse(formData);
    }
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  }

  function handlePrevious() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    const result = assessmentSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    formAction(result.data);
  }

  if (state?.success === true && "patientId" in state) {
    router.push(`/patients/${state.patientId}`);
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Step indicator */}
      <div className="flex flex-wrap gap-2">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          return (
            <Badge
              key={stepNum}
              variant={stepNum === currentStep ? "default" : stepNum < currentStep ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => stepNum < currentStep && setCurrentStep(stepNum)}
            >
              {stepNum}. {label}
            </Badge>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        {currentStep === 1 && (
          <PatientInfoStep
            data={formData.patientInformation}
            onChange={(v) => updateData("patientInformation", v)}
            errors={errors}
            readOnly={mode === "reassessment"}
          />
        )}
        {currentStep === 2 && (
          <MedicalHistoryStep
            data={formData.medicalHistory}
            onChange={(v) => updateData("medicalHistory", v)}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <PhysicalExamStep
            data={formData.physicalExamination}
            onChange={(v) => updateData("physicalExamination", v)}
            errors={errors}
          />
        )}
        {currentStep === 4 && (
          <PresentingComplaintStep
            data={formData.presentingComplaint}
            onChange={(v) => updateData("presentingComplaint", v)}
            errors={errors}
          />
        )}
        {currentStep === 5 && (
          <FunctionalAssessmentStep
            data={formData.functionalAssessment}
            onChange={(v) => updateData("functionalAssessment", v)}
            errors={errors}
          />
        )}
        {currentStep === 6 && (
          <AssessmentSummaryStep
            data={formData.assessmentSummary}
            onChange={(v) => updateData("assessmentSummary", v)}
            errors={errors}
          />
        )}
        {currentStep === 7 && (
          <TreatmentPlanStep
            data={formData.treatmentPlan}
            onChange={(v) => updateData("treatmentPlan", v)}
            errors={errors}
          />
        )}
        {currentStep === 8 && (
          <TherapistNotesStep
            data={formData.therapistNotes}
            onNotesChange={(v) => updateData("therapistNotes", v)}
            onDutyChange={(v) => updateData("therapistOnDuty", v)}
            notesValue={formData.notes ?? ""}
            onGeneralNotesChange={(v) => updateData("notes", v)}
            therapistOnDuty={formData.therapistOnDuty}
            errors={errors}
          />
        )}
      </div>

      {/* Error display */}
      {state?.success === false && "errors" in state && state.errors?.form && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.errors.form}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          ← Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        {currentStep < TOTAL_STEPS ? (
          <Button type="button" onClick={handleNext}>
            Next →
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Assessment"}
          </Button>
        )}
      </div>
    </div>
  );
}
