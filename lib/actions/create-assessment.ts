"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  assessmentSchema,
  type AssessmentInput,
} from "@/lib/validations/assessment";
import { generateSessions } from "@/lib/scheduler/generate-sessions";
import type { Prisma } from "@/app/generated/prisma/client";

type CreateAssessmentResult =
  | { success: true; patientId: string }
  | { success: false; errors: Record<string, string> };

export async function createNewPatientAssessment(
  formData: AssessmentInput
): Promise<CreateAssessmentResult> {
  const parsed = assessmentSchema.safeParse(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      errors[field] = issue.message;
    });
    return { success: false, errors };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          fullName: parsed.data.patientInformation.fullName,
          address: parsed.data.patientInformation.address,
          dateOfBirth: new Date(
            parsed.data.patientInformation.dateOfBirth
          ),
          gender: parsed.data.patientInformation.gender,
          contactNumber: parsed.data.patientInformation.contactNumber,
          email: parsed.data.patientInformation.email || null,
          occupation: parsed.data.patientInformation.occupation || null,
          hobbies: parsed.data.patientInformation.hobbies || null,
          emergencyContactName:
            parsed.data.patientInformation.emergencyContactName || null,
          emergencyContactPhone:
            parsed.data.patientInformation.emergencyContactPhone || null,
          insuranceProvider:
            parsed.data.patientInformation.insuranceProvider || null,
          insurancePolicyNumber:
            parsed.data.patientInformation.insurancePolicyNumber || null,
          status: "pending",
        },
      });

      const assessment = await tx.physicalTherapyAssessment.create({
        data: {
          patientId: patient.id,
          assessmentNumber: 1,
          patientInformation: parsed.data.patientInformation,
          medicalHistory: parsed.data.medicalHistory,
          physicalExamination: parsed.data.physicalExamination,
          presentingComplaint: parsed.data.presentingComplaint,
          functionalAssessment: parsed.data.functionalAssessment,
          assessmentSummary: parsed.data.assessmentSummary,
          treatmentPlan: parsed.data.treatmentPlan,
          therapistNotes: parsed.data.therapistNotes,
          therapistOnDuty: parsed.data.therapistOnDuty,
          notes: parsed.data.notes || null,
        },
      });

      const sessions = generateSessions(
        parsed.data.treatmentPlan.frequencyDuration
      );
      if (sessions.length > 0) {
        await tx.therapySession.createMany({
          data: sessions.map((s) => ({
            patientId: patient.id,
            assessmentId: assessment.id,
            therapistId: null,
            scheduledAt: s.scheduledAt,
            durationMinutes: s.durationMinutes,
            sessionNumber: s.sessionNumber,
            status: "scheduled" as const,
            sessionType: "treatment" as const,
          })),
        });
      }

      return { patientId: patient.id };
    });

    revalidatePath("/patients");
    revalidatePath("/dashboard");
    revalidatePath("/schedule");
    return { success: true, patientId: result.patientId };
  } catch {
    return {
      success: false,
      errors: { form: "Failed to create assessment. Please try again." },
    };
  }
}

export async function createReAssessment(
  patientId: string,
  formData: AssessmentInput
): Promise<CreateAssessmentResult> {
  const parsed = assessmentSchema.safeParse(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      errors[field] = issue.message;
    });
    return { success: false, errors };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.patient.findUnique({
        where: { id: patientId },
        select: { id: true },
      });
      if (!existing) {
        throw new Error("Patient not found");
      }

      const assessmentCount = await tx.physicalTherapyAssessment.count({
        where: { patientId },
      });

      const assessment = await tx.physicalTherapyAssessment.create({
        data: {
          patientId,
          assessmentNumber: assessmentCount + 1,
          patientInformation: parsed.data.patientInformation,
          medicalHistory: parsed.data.medicalHistory,
          physicalExamination: parsed.data.physicalExamination,
          presentingComplaint: parsed.data.presentingComplaint,
          functionalAssessment: parsed.data.functionalAssessment,
          assessmentSummary: parsed.data.assessmentSummary,
          treatmentPlan: parsed.data.treatmentPlan,
          therapistNotes: parsed.data.therapistNotes,
          therapistOnDuty: parsed.data.therapistOnDuty,
          notes: parsed.data.notes || null,
        },
      });

      const sessions = generateSessions(
        parsed.data.treatmentPlan.frequencyDuration
      );
      if (sessions.length > 0) {
        await tx.therapySession.createMany({
          data: sessions.map((s) => ({
            patientId,
            assessmentId: assessment.id,
            therapistId: null,
            scheduledAt: s.scheduledAt,
            durationMinutes: s.durationMinutes,
            sessionNumber: s.sessionNumber,
            status: "scheduled" as const,
            sessionType: "treatment" as const,
          })),
        });
      }

      return { patientId };
    });

    revalidatePath(`/patients/${patientId}`);
    revalidatePath("/patients");
    revalidatePath("/dashboard");
    revalidatePath("/schedule");
    return { success: true, patientId: result.patientId };
  } catch {
    return {
      success: false,
      errors: { form: "Failed to create re-assessment. Please try again." },
    };
  }
}
