import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PatientHeader } from "@/components/patients/patient-header";
import { AssessmentView } from "@/components/assessments/assessment-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, User, ClipboardList } from "lucide-react";

interface PatientProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      gender: true,
      status: true,
      contactNumber: true,
      email: true,
      address: true,
      dateOfBirth: true,
      occupation: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      insuranceProvider: true,
      insurancePolicyNumber: true,
    },
  });

  if (!patient) notFound();

  const [assessments, sessions] = await Promise.all([
    prisma.physicalTherapyAssessment.findMany({
      where: { patientId: id },
      orderBy: { assessmentNumber: "desc" },
    }),
    prisma.therapySession.findMany({
      where: { patientId: id },
      orderBy: { scheduledAt: "asc" },
      include: { therapist: { select: { fullName: true } } },
    }),
  ]);

  const serializedAssessments = assessments.map(
    (a: (typeof assessments)[number]) =>
      ({
        id: a.id,
        patientId: a.patientId,
        assessmentNumber: a.assessmentNumber,
        patientInformation: a.patientInformation as unknown as import("@/types/patient").PatientInformation,
        medicalHistory: a.medicalHistory as unknown as import("@/types/patient").MedicalHistory,
        physicalExamination: a.physicalExamination as unknown as import("@/types/patient").PhysicalExamination,
        presentingComplaint: a.presentingComplaint as unknown as import("@/types/patient").PresentingComplaint,
        functionalAssessment: a.functionalAssessment as unknown as import("@/types/patient").FunctionalAssessment,
        assessmentSummary: a.assessmentSummary as unknown as import("@/types/patient").AssessmentSummary,
        treatmentPlan: a.treatmentPlan as unknown as import("@/types/patient").TreatmentPlan,
        therapistNotes: a.therapistNotes as unknown as import("@/types/patient").TherapistNotes,
        therapistOnDuty: a.therapistOnDuty as unknown as import("@/types/patient").TherapistOnDuty,
        notes: a.notes,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }) satisfies import("@/types/patient").PhysicalTherapyAssessment
  );

  return (
    <div className="space-y-6">
      <PatientHeader
        patient={{
          ...patient,
          dateOfBirth: patient.dateOfBirth.toISOString(),
        }}
      />

      <Tabs defaultValue="assessments">
        <TabsList>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Assessments</h2>
              <Link href={`/patients/${id}/assessment`}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  New Assessment
                </Button>
              </Link>
            </div>
            <AssessmentView assessments={serializedAssessments} />
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Sessions</h2>
            </div>
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sessions scheduled yet.
              </p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s: (typeof sessions)[number]) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Session #{s.sessionNumber}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(s.scheduledAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>·</span>
                          <span>{s.durationMinutes} min</span>
                          <span>·</span>
                          <User className="h-3 w-3" />
                          <span>{s.therapist?.fullName ?? "Unassigned"}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={s.status === "completed" ? "default" : "outline"}>
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
