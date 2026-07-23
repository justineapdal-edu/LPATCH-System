"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";

const validTransitions: Record<string, string[]> = {
  pending: ["active"],
  active: ["inactive", "discharged"],
  inactive: ["active", "discharged"],
  discharged: [],
};

const statusSchema = z.object({
  patientId: z.string().uuid(),
  newStatus: z.enum(["active", "inactive", "discharged"]),
});

type UpdateStatusResult =
  | { success: true }
  | { success: false; error: string };

export async function updatePatientStatus(
  input: z.infer<typeof statusSchema>
): Promise<UpdateStatusResult> {
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const patient = await prisma.patient.findUnique({
    where: { id: parsed.data.patientId },
    select: { status: true },
  });

  if (!patient) {
    return { success: false, error: "Patient not found" };
  }

  const allowed = validTransitions[patient.status] ?? [];
  if (!allowed.includes(parsed.data.newStatus)) {
    return {
      success: false,
      error: `Cannot transition from "${patient.status}" to "${parsed.data.newStatus}"`,
    };
  }

  await prisma.patient.update({
    where: { id: parsed.data.patientId },
    data: { status: parsed.data.newStatus },
  });

  revalidatePath(`/patients/${parsed.data.patientId}`);
  revalidatePath("/patients");
  revalidatePath("/dashboard");
  return { success: true };
}
