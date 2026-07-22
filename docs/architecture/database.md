# Database Architecture

> Prisma schema, table definitions, JSONB strategy, migrations, and seeding.

---

## 1. Technology Choice

| Concern | Choice |
|---------|--------|
| **ORM** | Prisma 6 |
| **Database** | PostgreSQL 15+ |
| **Hosting** | Supabase (managed PostgreSQL) |
| **Migration** | `prisma migrate dev` / `prisma migrate deploy` |
| **Client** | `@prisma/client` via singleton in `lib/db.ts` |

---

## 2. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Therapist ───────────────────────────────────────────────────

model Therapist {
  id            String   @id @default(uuid())
  fullName      String
  licenseNumber String   @unique
  email         String?  @unique
  phone         String?
  specialization String?
  status        String   @default("active") // active | inactive
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  assessments   PhysicalTherapyAssessment[]
  sessions      TherapySession[]
  progressNotes ProgressNote[]

  @@index([fullName])
  @@index([licenseNumber])
}

// ── Patient ─────────────────────────────────────────────────────

model Patient {
  id             String   @id @default(uuid())
  fullName       String
  address        String
  dateOfBirth    DateTime
  gender         String   // male | female | other | prefer_not_to_say
  contactNumber  String
  email          String?
  occupation     String?
  hobbies        String?
  emergencyContactName     String?
  emergencyContactPhone    String?
  insuranceProvider        String?
  insurancePolicyNumber    String?
  status         String   @default("pending") // pending | active | inactive | discharged
  notes          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  assessments   PhysicalTherapyAssessment[]
  sessions      TherapySession[]
  progressNotes ProgressNote[]

  @@index([fullName])
  @@index([status])
  @@index([contactNumber])
}

// ── Physical Therapy Assessment ─────────────────────────────────

model PhysicalTherapyAssessment {
  id              String   @id @default(uuid())
  patientId       String
  assessmentNumber Int     @default(1) // 1st, 2nd, 3rd assessment for this patient

  // Page 1 — Patient Information (JSONB)
  patientInformation Json

  // Page 1 — Medical History (JSONB)
  medicalHistory Json

  // Page 1 — Physical Examination (JSONB)
  physicalExamination Json

  // Page 1 — Presenting Complaint (JSONB)
  presentingComplaint Json

  // Page 1 — Functional Assessment (JSONB)
  functionalAssessment Json

  // Page 2 — Assessment Summary (JSONB)
  assessmentSummary Json

  // Page 2 — Treatment Plan (JSONB — includes frequencyDuration)
  treatmentPlan Json

  // Page 2 — Therapist Notes (JSONB)
  therapistNotes Json

  // Page 2 — Therapist on Duty (JSONB — includes name, license, date, signature)
  therapistOnDuty Json

  // Additional notes
  notes String?

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  sessions  TherapySession[]

  @@index([patientId])
  @@index([patientId, assessmentNumber])
  @@index([createdAt])
}

// ── Therapy Session ─────────────────────────────────────────────

model TherapySession {
  id              String   @id @default(uuid())
  patientId       String
  assessmentId    String
  therapistId     String?  // NULLABLE — sessions can exist without assigned therapist
  scheduledAt     DateTime
  durationMinutes Int
  status          String   @default("scheduled") // scheduled | completed | cancelled | no_show
  sessionType     String   @default("treatment") // evaluation | treatment | follow_up | discharge
  sessionNumber   Int      // 1-based index within the treatment plan
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  patient      Patient      @relation(fields: [patientId], references: [id], onDelete: Cascade)
  assessment   PhysicalTherapyAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  therapist    Therapist?   @relation(fields: [therapistId], references: [id], onDelete: SetNull)
  progressNote ProgressNote?

  @@index([patientId])
  @@index([therapistId])
  @@index([assessmentId])
  @@index([scheduledAt])
  @@index([status])
  @@index([therapistId, scheduledAt]) // For conflict detection
}

// ── Progress Note ───────────────────────────────────────────────

model ProgressNote {
  id                String   @id @default(uuid())
  sessionId         String   @unique
  patientId         String
  therapistId       String
  content           String
  painLevel         Int      // 0-10
  rangeOfMotion     String?
  functionalOutcome String?
  createdAt         DateTime @default(now())

  // Relations
  session   TherapySession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  patient   Patient        @relation(fields: [patientId], references: [id], onDelete: Cascade)
  therapist Therapist      @relation(fields: [therapistId], references: [id], onDelete: Cascade)

  @@index([patientId])
  @@index([therapistId])
  @@index([createdAt])
}
```

---

## 3. JSONB Column Strategy

Assessment sections are stored as JSONB to preserve the flexible structure of clinical text fields without creating dozens of narrow columns.

### JSONB Mapping

| Column | TypeScript Interface | Stored Structure |
|--------|---------------------|------------------|
| `patientInformation` | `PatientInformation` | `{ fullName, address, dateOfBirth, gender, contactNumber, occupation, hobbies, dateOfAssessment, referringDoctor, email, emergencyContactName, emergencyContactPhone, insuranceProvider, insurancePolicyNumber }` |
| `medicalHistory` | `MedicalHistory` | `{ hypertension, diabetes, cardiovascularDisease, respiratoryConditions, neurologicalDisorders, musculoskeletalInjuries, surgeries, medications, allergies, otherHistory }` |
| `physicalExamination` | `PhysicalExamination` | `{ posture, gait, rangeOfMotion, muscleStrength, jointIntegrity, neurologicalScreening, specialTests }` |
| `presentingComplaint` | `PresentingComplaint` | `{ description, onsetDuration, aggravatingRelievingFactors, painScale, functionalLimitations }` |
| `functionalAssessment` | `FunctionalAssessment` | `{ adls, mobilityStatus, balanceCoordination, assistiveDevices, workLimitations }` |
| `assessmentSummary` | `AssessmentSummary` | `{ clinicalImpression, ptDiagnosis, prognosis, goals }` |
| `treatmentPlan` | `TreatmentPlan` | `{ frequencyDuration: { frequency, durationMinutes, totalWeeks, preferredTimeOfDay, startDate }, modalities, therapeuticExercises, manualTherapy, homeExerciseProgram, educationCounseling }` |
| `therapistNotes` | `TherapistNotes` | `{ initialResponse, recommendations, followUpDate }` |
| `therapistOnDuty` | `TherapistOnDuty` | `{ name, licenseNumber, date, signatureBase64 }` |

### Querying JSONB

```typescript
// Example: Find all patients with hypertension checked
const patients = await prisma.physicalTherapyAssessment.findMany({
  where: {
    medicalHistory: {
      path: ["hypertension"],
      equals: true,
    },
  },
});

// Example: Filter by pain scale > 7
const severePain = await prisma.physicalTherapyAssessment.findMany({
  where: {
    presentingComplaint: {
      path: ["painScale"],
      gt: 7,
    },
  },
});
```

### Scalar Columns on Patient (Denormalized)

For search/filter performance, these fields are also stored as scalar columns on the `patients` table (duplicated from `patientInformation` JSONB):

- `fullName` — for search and sort
- `gender` — for filter
- `status` — for filter
- `contactNumber` — for search
- `email` — for search
- `dateOfBirth` — for age calculations

---

## 4. Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `patients` | `fullName` | Search by name |
| `patients` | `status` | Filter by status |
| `patients` | `contactNumber` | Search by phone |
| `therapists` | `fullName` | Search by name |
| `therapists` | `licenseNumber` (unique) | Lookup by license |
| `assessments` | `patientId` | All assessments for a patient |
| `assessments` | `patientId + assessmentNumber` | Unique assessment per patient |
| `sessions` | `patientId` | All sessions for a patient |
| `sessions` | `therapistId` | All sessions for a therapist |
| `sessions` | `therapistId + scheduledAt` | Conflict detection query |
| `sessions` | `scheduledAt` | Calendar date range queries |
| `sessions` | `status` | Filter by status |
| `progress_notes` | `patientId` | All notes for a patient |

---

## 5. Session Conflict Detection

When auto-generating sessions, check for therapist time overlaps. Only applies when `therapistId` is assigned.

```typescript
// lib/db/session-conflicts.ts

import { prisma } from "@/lib/db";

interface ConflictCheck {
  therapistId: string;
  scheduledAt: Date;
  durationMinutes: number;
}

export async function hasTherapistConflict(check: ConflictCheck): Promise<boolean> {
  const sessionEnd = new Date(
    check.scheduledAt.getTime() + check.durationMinutes * 60_000
  );

  const conflict = await prisma.therapySession.findFirst({
    where: {
      therapistId: check.therapistId,
      status: { notIn: ["cancelled"] },
      scheduledAt: {
        lt: sessionEnd,             // Existing session starts before new one ends
      },
      // Check if existing session overlaps
      // Prisma doesn't directly support range overlap, so we use a raw filter:
    },
  });

  // Raw SQL for range overlap check:
  // SELECT id FROM therapy_sessions
  // WHERE therapist_id = $1
  //   AND status != 'cancelled'
  //   AND scheduled_at < $2                               -- existing starts before new ends
  //   AND scheduled_at + (duration_minutes || ' minutes')::interval > $3  -- existing ends after new starts
  // LIMIT 1

  return conflict !== null;
}
```

### Conflict Rules
- **Only checks therapist overlap** — patients can have overlapping sessions with different therapists
- **Skips check if `therapistId` is null** — unassigned sessions never conflict
- **Excludes cancelled sessions** from conflict checks
- **Auto-generated sessions** are created WITHOUT a therapist (null) — therapist assignment is a separate manual action

---

## 6. Patient Status Transitions

Status changes are **manual only** — triggered by a button on the patient profile.

### Valid Transitions

```
pending ──────► active ──────► inactive
                  │                │
                  │                ▼
                  └──────────► discharged
```

| From | To | Trigger | Allowed By |
|------|----|---------|------------|
| `pending` | `active` | First assessment completed | Therapist / Admin |
| `active` | `inactive` | Patient pauses treatment | Therapist / Admin |
| `active` | `discharged` | Treatment complete | Therapist only |
| `inactive` | `active` | Patient resumes treatment | Therapist / Admin |
| `inactive` | `discharged` | Long-term inactive | Admin only |

### Implementation

```typescript
// lib/actions/update-patient-status.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const validTransitions: Record<string, string[]> = {
  pending: ["active"],
  active: ["inactive", "discharged"],
  inactive: ["active", "discharged"],
  discharged: [], // Cannot transition out of discharged
};

const statusSchema = z.object({
  patientId: z.string().uuid(),
  newStatus: z.enum(["active", "inactive", "discharged"]),
});

export async function updatePatientStatus(
  input: z.infer<typeof statusSchema>
): Promise<{ success: boolean; error?: string }> {
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
```

---

## 7. Signature Storage

Therapist signatures are captured via a canvas drawing pad (`signature_pad` library) and stored as **base64 PNG** in the `therapistOnDuty` JSONB column.

### Storage Format
```json
{
  "name": "Dr. Juan dela Cruz",
  "licenseNumber": "PT-2024-00123",
  "date": "2026-01-15",
  "signatureBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
}
```

### Display
- Render via `<img src={signatureBase64} alt="Therapist Signature" />`
- Scale to fit container with `max-w-[200px] h-auto`
- Store at original resolution (canvas default: ~300x150px)

### Size Limits
- Max signature image size: **100KB** (enforced client-side before submission)
- Canvas dimensions: 300px × 150px (2:1 ratio)
- Format: PNG (lossless for line art)

---

## 8. Migrations

### Naming Convention
```
20260115_create_therapists
20260115_create_patients
20260115_create_assessments
20260115_create_therapy_sessions
20260115_create_progress_notes
20260115_add_jsonb_indexes
```

### Commands
```bash
# Create migration
npx prisma migrate dev --name create_therapists

# Apply pending migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

---

## 9. Seeding

```typescript
// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample therapists
  const therapist1 = await prisma.therapist.create({
    data: {
      fullName: "Dr. Juan dela Cruz",
      licenseNumber: "PT-2024-00123",
      email: "juan@example.com",
      phone: "+63 917 123 4567",
      specialization: "Orthopedic Physical Therapy",
      status: "active",
    },
  });

  const therapist2 = await prisma.therapist.create({
    data: {
      fullName: "Dr. Maria Santos",
      licenseNumber: "PT-2024-00456",
      email: "maria@example.com",
      phone: "+63 918 765 4321",
      specialization: "Neurological Physical Therapy",
      status: "active",
    },
  });

  console.log("Seeded 2 therapists");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

### Commands
```bash
npx prisma db seed
```

---

## 10. DO's and DON'Ts

### DO's
- **DO** use the Prisma client singleton (`lib/db.ts`) — never instantiate `new PrismaClient()` outside of it
- **DO** use transactions for multi-table operations (assessment + sessions creation)
- **DO** use `@default(uuid())` for all primary keys
- **DO** use `onDelete: Cascade` for child records (sessions → patient)
- **DO** use `onDelete: SetNull` for optional references (session → therapist)
- **DO** run `npx prisma generate` after schema changes
- **DO** keep JSONB columns typed via TypeScript interfaces (infer from Zod)
- **DO** use Prisma's `select` to avoid over-fetching large JSONB columns

### DON'Ts
- **DON'T** use `$queryRaw` unless Prisma's query builder cannot express the logic
- **DON'T** store file attachments as base64 in the main tables (use Supabase Storage in Phase 2)
- **DON'T** use `create` without `select` when you only need the ID back
- **DON'T** hardcode UUIDs in seed data — use dynamic generation
- **DON'T** modify the migration files after they've been applied
- **DON'T** use `updateMany` without a `where` clause (accidental full-table update)
