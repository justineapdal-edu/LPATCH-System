"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { PhysicalTherapyAssessment } from "@/types/patient";
import {
  Stethoscope,
  Activity,
  AlertCircle,
  FileText,
  Dumbbell,
  ClipboardCheck,
  Pen,
  CheckCircle2,
} from "lucide-react";

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
          <Section title="Medical History" icon={Stethoscope}>
            <div className="flex flex-wrap gap-2">
              {current.medicalHistory.hypertension && (
                <Badge variant="secondary" className="text-xs">Hypertension</Badge>
              )}
              {current.medicalHistory.diabetes && (
                <Badge variant="secondary" className="text-xs">Diabetes</Badge>
              )}
              {current.medicalHistory.cardiovascularDisease && (
                <Badge variant="secondary" className="text-xs">Cardiovascular</Badge>
              )}
              {current.medicalHistory.respiratoryConditions && (
                <Badge variant="secondary" className="text-xs">Respiratory</Badge>
              )}
              {current.medicalHistory.neurologicalDisorders && (
                <Badge variant="secondary" className="text-xs">Neurological</Badge>
              )}
              {current.medicalHistory.musculoskeletalInjuries && (
                <Badge variant="secondary" className="text-xs">Musculoskeletal</Badge>
              )}
            </div>
            {current.medicalHistory.medications && (
              <p className="mt-2 text-sm">Medications: {current.medicalHistory.medications}</p>
            )}
          </Section>

          <Section title="Physical Examination" icon={Activity}>
            <Field label="Posture" value={current.physicalExamination.posture} />
            <Field label="Gait" value={current.physicalExamination.gait} />
            <Field label="ROM" value={current.physicalExamination.rangeOfMotion} />
            <Field label="Strength" value={current.physicalExamination.muscleStrength} />
            <Field label="Joints" value={current.physicalExamination.jointIntegrity} />
            <Field label="Neuro" value={current.physicalExamination.neurologicalScreening} />
          </Section>

          <Section title="Presenting Complaint" icon={AlertCircle}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Pain:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${
                      i < current.presentingComplaint.painScale
                        ? i < 4
                          ? "bg-emerald-400"
                          : i < 7
                          ? "bg-amber-400"
                          : "bg-red-400"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">{current.presentingComplaint.painScale}/10</span>
            </div>
            <p className="mt-2 text-sm">{current.presentingComplaint.description}</p>
          </Section>
        </TabsContent>

        <TabsContent value="page2" className="space-y-4">
          <Section title="Treatment Plan" icon={Dumbbell}>
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline">{current.treatmentPlan.frequencyDuration.frequency}</Badge>
              <Badge variant="outline">{current.treatmentPlan.frequencyDuration.durationMinutes} min</Badge>
              <Badge variant="outline">{current.treatmentPlan.frequencyDuration.totalWeeks} weeks</Badge>
            </div>
            <Field label="Exercises" value={current.treatmentPlan.therapeuticExercises} />
            <Field label="HEP" value={current.treatmentPlan.homeExerciseProgram} />
          </Section>

          <Section title="Therapist on Duty" icon={ClipboardCheck}>
            <div className="flex items-center gap-2">
              <Pen className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm">
                {current.therapistOnDuty.name} ({current.therapistOnDuty.licenseNumber})
              </p>
            </div>
            {current.therapistOnDuty.signatureBase64 && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <img
                  src={current.therapistOnDuty.signatureBase64}
                  alt="Signature"
                  className="h-8 w-auto"
                />
              </div>
            )}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span className="font-medium text-foreground">{label}:</span>{" "}
      <span className="text-muted-foreground">{value}</span>
    </p>
  );
}
