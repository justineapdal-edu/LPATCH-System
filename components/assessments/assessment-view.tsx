"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { PhysicalTherapyAssessment } from "@/types/patient";

interface AssessmentViewProps {
  assessments: PhysicalTherapyAssessment[];
}

export function AssessmentView({ assessments }: AssessmentViewProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = assessments[selectedIdx];

  if (!current) {
    return (
      <p className="text-sm text-muted-foreground">No assessments found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Assessment selector */}
      <div className="flex flex-wrap gap-2">
        {assessments.map((a, i) => (
          <Badge
            key={a.id}
            variant={i === selectedIdx ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedIdx(i)}
          >
            Assessment #{a.assessmentNumber}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="page1">
        <TabsList>
          <TabsTrigger value="page1">Page 1</TabsTrigger>
          <TabsTrigger value="page2">Page 2</TabsTrigger>
        </TabsList>

        <TabsContent value="page1" className="space-y-4">
          <Section title="Medical History">
            <div className="flex flex-wrap gap-3 text-sm">
              {current.medicalHistory.hypertension && <span>Hypertension</span>}
              {current.medicalHistory.diabetes && <span>Diabetes</span>}
              {current.medicalHistory.cardiovascularDisease && <span>Cardiovascular</span>}
              {current.medicalHistory.respiratoryConditions && <span>Respiratory</span>}
              {current.medicalHistory.neurologicalDisorders && <span>Neurological</span>}
              {current.medicalHistory.musculoskeletalInjuries && <span>Musculoskeletal</span>}
            </div>
            {current.medicalHistory.medications && (
              <p className="text-sm">Medications: {current.medicalHistory.medications}</p>
            )}
          </Section>

          <Section title="Physical Examination">
            <Field label="Posture" value={current.physicalExamination.posture} />
            <Field label="Gait" value={current.physicalExamination.gait} />
            <Field label="ROM" value={current.physicalExamination.rangeOfMotion} />
            <Field label="Strength" value={current.physicalExamination.muscleStrength} />
            <Field label="Joints" value={current.physicalExamination.jointIntegrity} />
            <Field label="Neuro" value={current.physicalExamination.neurologicalScreening} />
          </Section>

          <Section title="Presenting Complaint">
            <p className="text-sm">
              Pain: {current.presentingComplaint.painScale}/10
            </p>
            <p className="text-sm">{current.presentingComplaint.description}</p>
          </Section>
        </TabsContent>

        <TabsContent value="page2" className="space-y-4">
          <Section title="Treatment Plan">
            <p className="text-sm">
              {current.treatmentPlan.frequencyDuration.frequency} ·{" "}
              {current.treatmentPlan.frequencyDuration.durationMinutes} min ·{" "}
              {current.treatmentPlan.frequencyDuration.totalWeeks} weeks
            </p>
            <Field label="Exercises" value={current.treatmentPlan.therapeuticExercises} />
            <Field label="HEP" value={current.treatmentPlan.homeExerciseProgram} />
          </Section>

          <Section title="Therapist on Duty">
            <p className="text-sm">
              {current.therapistOnDuty.name} ({current.therapistOnDuty.licenseNumber})
            </p>
            {current.therapistOnDuty.signatureBase64 && (
              <img
                src={current.therapistOnDuty.signatureBase64}
                alt="Signature"
                className="mt-2 max-w-[200px] h-auto border"
              />
            )}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border p-3">
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
}
