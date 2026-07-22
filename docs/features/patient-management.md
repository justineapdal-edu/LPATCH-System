# Patient Management

> Handles PT assessment form, patient directory, detailed profiles, and admin onboarding workflows.

---

## 1. Physical Therapy Assessment Form — Field Map

The core data model is a **two-page assessment form** completed during patient intake and updated throughout treatment.

### PAGE 1: Patient Information

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Full Name | Text | `fullName` | Yes |
| Complete Address | Text | `address` | Yes |
| Date of Birth | Date picker | `dateOfBirth` | Yes |
| Gender | Dropdown | `gender` | Yes |
| Contact Number | Number (tel) | `contactNumber` | Yes |
| Occupation | Text | `occupation` | No |
| Hobbies | Text | `hobbies` | No |
| Date of Assessment | Date picker | `dateOfAssessment` | Yes |
| Referring Doctor / Institution | Text | `referringDoctor` | No |

### PAGE 1: Medical History

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Hypertension | Checkbox | `medicalHistory.hypertension` | No |
| Diabetes | Checkbox | `medicalHistory.diabetes` | No |
| Cardiovascular Disease | Checkbox | `medicalHistory.cardiovascularDisease` | No |
| Respiratory Conditions | Checkbox | `medicalHistory.respiratoryConditions` | No |
| Neurological Disorders | Checkbox | `medicalHistory.neurologicalDisorders` | No |
| Musculoskeletal Injuries | Checkbox | `medicalHistory.musculoskeletalInjuries` | No |
| Surgeries (specify) | Text | `medicalHistory.surgeries` | No |
| Medications (list) | Text | `medicalHistory.medications` | No |
| Allergies | Text | `medicalHistory.allergies` | No |
| Other relevant history | Text | `medicalHistory.otherHistory` | No |

### PAGE 1: Physical Examination

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Posture | Text | `physicalExamination.posture` | Yes |
| Gait | Text | `physicalExamination.gait` | Yes |
| Range of Motion | Text | `physicalExamination.rangeOfMotion` | Yes |
| Muscle Strength | Text | `physicalExamination.muscleStrength` | Yes |
| Joint Integrity | Text | `physicalExamination.jointIntegrity` | Yes |
| Neurological Screening | Text | `physicalExamination.neurologicalScreening` | Yes |
| Special Tests | Text | `physicalExamination.specialTests` | No |

### PAGE 1: Presenting Complaint

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Description of symptoms | Textarea | `presentingComplaint.description` | Yes |
| Onset and duration | Text | `presentingComplaint.onsetDuration` | Yes |
| Aggravating / relieving factors | Text | `presentingComplaint.aggravatingRelievingFactors` | Yes |
| Pain scale (0-10) | Number slider | `presentingComplaint.painScale` | Yes |
| Functional limitations | Textarea | `presentingComplaint.functionalLimitations` | Yes |

### PAGE 1: Functional Assessment

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Activities of Daily Living (ADLs) | Textarea | `functionalAssessment.adls` | Yes |
| Mobility status | Text | `functionalAssessment.mobilityStatus` | Yes |
| Balance and coordination | Text | `functionalAssessment.balanceCoordination` | Yes |
| Assistive devices used | Text | `functionalAssessment.assistiveDevices` | No |
| Work/school limitations | Textarea | `functionalAssessment.workLimitations` | No |

### PAGE 2: Assessment Summary

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Clinical impression | Textarea | `assessmentSummary.clinicalImpression` | Yes |
| PT diagnosis | Text | `assessmentSummary.ptDiagnosis` | Yes |
| Prognosis | Text | `assessmentSummary.prognosis` | Yes |
| Goals (short-term and long-term) | Textarea | `assessmentSummary.goals` | Yes |

### PAGE 2: Treatment Plan

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Frequency and duration of sessions | Structured input (see Section 7) | `treatmentPlan.frequencyDuration` | Yes |
| Modalities to be used | Text | `treatmentPlan.modalities` | No |
| Therapeutic exercises | Textarea | `treatmentPlan.therapeuticExercises` | Yes |
| Manual therapy | Text | `treatmentPlan.manualTherapy` | No |
| Home exercise program | Textarea | `treatmentPlan.homeExerciseProgram` | Yes |
| Education and counseling | Textarea | `treatmentPlan.educationCounseling` | No |

### PAGE 2: Therapist Notes

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Initial response to treatment | Textarea | `therapistNotes.initialResponse` | No |
| Recommendations | Textarea | `therapistNotes.recommendations` | No |
| Follow-up date | Date picker | `therapistNotes.followUpDate` | Yes |

### PAGE 2: Therapist on Duty

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Name with signature | Text + signature pad | `therapistOnDuty.name` | Yes |
| License # | Text | `therapistOnDuty.licenseNumber` | Yes |
| Date | Date picker | `therapistOnDuty.date` | Yes |

### Notes

| Field | Input Type | Key | Required |
|-------|-----------|-----|----------|
| Additional notes | Textarea | `notes` | No |

---

## 2. TypeScript Interfaces

```typescript
// types/patient.ts

export type PatientStatus = "active" | "inactive" | "discharged" | "pending";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

// ── Patient Information ──────────────────────────────────────────

export interface PatientInformation {
  fullName: string;
  address: string;
  dateOfBirth: string;              // ISO 8601 date (YYYY-MM-DD)
  gender: Gender;
  contactNumber: string;
  occupation: string;
  hobbies: string;
  dateOfAssessment: string;         // ISO 8601 date
  referringDoctor: string;
}

// ── Medical History ──────────────────────────────────────────────

export interface MedicalHistory {
  hypertension: boolean;
  diabetes: boolean;
  cardiovascularDisease: boolean;
  respiratoryConditions: boolean;
  neurologicalDisorders: boolean;
  musculoskeletalInjuries: boolean;
  surgeries: string;
  medications: string;
  allergies: string;
  otherHistory: string;
}

// ── Physical Examination ─────────────────────────────────────────

export interface PhysicalExamination {
  posture: string;
  gait: string;
  rangeOfMotion: string;
  muscleStrength: string;
  jointIntegrity: string;
  neurologicalScreening: string;
  specialTests: string;
}

// ── Presenting Complaint ─────────────────────────────────────────

export interface PresentingComplaint {
  description: string;
  onsetDuration: string;
  aggravatingRelievingFactors: string;
  painScale: number;                // 0-10
  functionalLimitations: string;
}

// ── Functional Assessment ────────────────────────────────────────

export interface FunctionalAssessment {
  adls: string;
  mobilityStatus: string;
  balanceCoordination: string;
  assistiveDevices: string;
  workLimitations: string;
}

// ── Assessment Summary ───────────────────────────────────────────

export interface AssessmentSummary {
  clinicalImpression: string;
  ptDiagnosis: string;
  prognosis: string;
  goals: string;                    // Short-term and long-term goals
}

// ── Treatment Plan ───────────────────────────────────────────────

export const SessionFrequency = {
  OncePerWeek: "1x/week",
  TwicePerWeek: "2x/week",
  ThreeTimesPerWeek: "3x/week",
  FiveTimesPerWeek: "5x/week",
  Daily: "daily",
} as const;

export type SessionFrequency =
  (typeof SessionFrequency)[keyof typeof SessionFrequency];

export const SessionDuration = {
  ThirtyMinutes: 30,
  FortyFiveMinutes: 45,
  SixtyMinutes: 60,
  NinetyMinutes: 90,
} as const;

export type SessionDuration =
  (typeof SessionDuration)[keyof typeof SessionDuration];

export interface FrequencyDuration {
  frequency: SessionFrequency;
  durationMinutes: SessionDuration;
  totalWeeks: number;               // Estimated treatment duration
  preferredTimeOfDay: "morning" | "afternoon" | "evening" | "any";
  startDate: string;                // ISO 8601 date
}

export interface TreatmentPlan {
  frequencyDuration: FrequencyDuration;
  modalities: string;
  therapeuticExercises: string;
  manualTherapy: string;
  homeExerciseProgram: string;
  educationCounseling: string;
}

// ── Therapist Notes ──────────────────────────────────────────────

export interface TherapistNotes {
  initialResponse: string;
  recommendations: string;
  followUpDate: string;             // ISO 8601 date
}

// ── Therapist on Duty ────────────────────────────────────────────

export interface TherapistOnDuty {
  name: string;
  licenseNumber: string;
  date: string;                     // ISO 8601 date
}

// ── Root Assessment ──────────────────────────────────────────────

export interface PhysicalTherapyAssessment {
  id: string;                       // UUID
  patientId: string;                // FK -> Patient

  // Page 1
  patientInformation: PatientInformation;
  medicalHistory: MedicalHistory;
  physicalExamination: PhysicalExamination;
  presentingComplaint: PresentingComplaint;
  functionalAssessment: FunctionalAssessment;

  // Page 2
  assessmentSummary: AssessmentSummary;
  treatmentPlan: TreatmentPlan;
  therapistNotes: TherapistNotes;
  therapistOnDuty: TherapistOnDuty;
  notes: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ── Therapy Session (auto-generated from FrequencyDuration) ──────

export type SessionStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type SessionType =
  | "evaluation"
  | "treatment"
  | "follow_up"
  | "discharge";

export interface TherapySession {
  id: string;                       // UUID
  patientId: string;                // FK -> Patient
  assessmentId: string;             // FK -> PhysicalTherapyAssessment
  therapistId: string;              // FK -> Therapist
  scheduledAt: string;              // ISO 8601 datetime
  durationMinutes: number;
  status: SessionStatus;
  sessionType: SessionType;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Progress Note ────────────────────────────────────────────────

export interface ProgressNote {
  id: string;                       // UUID
  sessionId: string;                // FK -> TherapySession
  patientId: string;                // FK -> Patient
  therapistId: string;              // FK -> Therapist
  content: string;
  painLevel: number;                // 0-10
  rangeOfMotion: string;
  functionalOutcome: string;
  createdAt: string;
}
```

---

## 3. Zod Validation Schema

```typescript
// lib/validations/assessment.ts

import { z } from "zod";

// ── Page 1: Patient Information ──────────────────────────────────

const patientInformationSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    required_error: "Gender is required",
  }),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^\+?[\d\s\-()]+$/, "Invalid phone number format"),
  occupation: z.string().max(100).optional(),
  hobbies: z.string().max(200).optional(),
  dateOfAssessment: z.string().min(1, "Date of assessment is required"),
  referringDoctor: z.string().max(100).optional(),
});

// ── Page 1: Medical History ──────────────────────────────────────

const medicalHistorySchema = z.object({
  hypertension: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  cardiovascularDisease: z.boolean().default(false),
  respiratoryConditions: z.boolean().default(false),
  neurologicalDisorders: z.boolean().default(false),
  musculoskeletalInjuries: z.boolean().default(false),
  surgeries: z.string().max(1000).optional(),
  medications: z.string().max(1000).optional(),
  allergies: z.string().max(500).optional(),
  otherHistory: z.string().max(1000).optional(),
});

// ── Page 1: Physical Examination ─────────────────────────────────

const physicalExaminationSchema = z.object({
  posture: z.string().min(1, "Posture assessment is required"),
  gait: z.string().min(1, "Gait assessment is required"),
  rangeOfMotion: z.string().min(1, "Range of motion is required"),
  muscleStrength: z.string().min(1, "Muscle strength assessment is required"),
  jointIntegrity: z.string().min(1, "Joint integrity assessment is required"),
  neurologicalScreening: z.string().min(1, "Neurological screening is required"),
  specialTests: z.string().optional(),
});

// ── Page 1: Presenting Complaint ─────────────────────────────────

const presentingComplaintSchema = z.object({
  description: z.string().min(1, "Symptom description is required"),
  onsetDuration: z.string().min(1, "Onset and duration is required"),
  aggravatingRelievingFactors: z
    .string()
    .min(1, "Aggravating/relieving factors are required"),
  painScale: z
    .number()
    .int()
    .min(0, "Pain scale must be 0 or greater")
    .max(10, "Pain scale must be 10 or less"),
  functionalLimitations: z
    .string()
    .min(1, "Functional limitations are required"),
});

// ── Page 1: Functional Assessment ────────────────────────────────

const functionalAssessmentSchema = z.object({
  adls: z.string().min(1, "ADL assessment is required"),
  mobilityStatus: z.string().min(1, "Mobility status is required"),
  balanceCoordination: z.string().min(1, "Balance/coordination assessment is required"),
  assistiveDevices: z.string().optional(),
  workLimitations: z.string().optional(),
});

// ── Page 2: Assessment Summary ───────────────────────────────────

const assessmentSummarySchema = z.object({
  clinicalImpression: z.string().min(1, "Clinical impression is required"),
  ptDiagnosis: z.string().min(1, "PT diagnosis is required"),
  prognosis: z.string().min(1, "Prognosis is required"),
  goals: z.string().min(1, "Treatment goals are required"),
});

// ── Page 2: Treatment Plan (Frequency & Duration) ────────────────

const frequencyDurationSchema = z.object({
  frequency: z.enum(["1x/week", "2x/week", "3x/week", "5x/week", "daily"], {
    required_error: "Session frequency is required",
  }),
  durationMinutes: z.union([z.literal(30), z.literal(45), z.literal(60), z.literal(90)], {
    required_error: "Session duration is required",
  }),
  totalWeeks: z
    .number()
    .int()
    .min(1, "Must be at least 1 week")
    .max(52, "Cannot exceed 52 weeks"),
  preferredTimeOfDay: z.enum(["morning", "afternoon", "evening", "any"], {
    required_error: "Preferred time of day is required",
  }),
  startDate: z.string().min(1, "Start date is required"),
});

const treatmentPlanSchema = z.object({
  frequencyDuration: frequencyDurationSchema,
  modalities: z.string().optional(),
  therapeuticExercises: z.string().min(1, "Therapeutic exercises are required"),
  manualTherapy: z.string().optional(),
  homeExerciseProgram: z.string().min(1, "Home exercise program is required"),
  educationCounseling: z.string().optional(),
});

// ── Page 2: Therapist Notes ──────────────────────────────────────

const therapistNotesSchema = z.object({
  initialResponse: z.string().optional(),
  recommendations: z.string().optional(),
  followUpDate: z.string().min(1, "Follow-up date is required"),
});

// ── Page 2: Therapist on Duty ────────────────────────────────────

const therapistOnDutySchema = z.object({
  name: z.string().min(1, "Therapist name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  date: z.string().min(1, "Date is required"),
});

// ── Root Schema ──────────────────────────────────────────────────

export const assessmentSchema = z.object({
  patientInformation: patientInformationSchema,
  medicalHistory: medicalHistorySchema,
  physicalExamination: physicalExaminationSchema,
  presentingComplaint: presentingComplaintSchema,
  functionalAssessment: functionalAssessmentSchema,
  assessmentSummary: assessmentSummarySchema,
  treatmentPlan: treatmentPlanSchema,
  therapistNotes: therapistNotesSchema,
  therapistOnDuty: therapistOnDutySchema,
  notes: z.string().max(5000).optional(),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;

// ── Individual page schemas for step-by-step validation ──────────

export const page1Schema = z.object({
  patientInformation: patientInformationSchema,
  medicalHistory: medicalHistorySchema,
  physicalExamination: physicalExaminationSchema,
  presentingComplaint: presentingComplaintSchema,
  functionalAssessment: functionalAssessmentSchema,
});

export const page2Schema = z.object({
  assessmentSummary: assessmentSummarySchema,
  treatmentPlan: treatmentPlanSchema,
  therapistNotes: therapistNotesSchema,
  therapistOnDuty: therapistOnDutySchema,
  notes: z.string().max(5000).optional(),
});

export type Page1Input = z.infer<typeof page1Schema>;
export type Page2Input = z.infer<typeof page2Schema>;
```

---

## 4. Patient Directory Page (`/patients`)

### Features
- **Search bar** - Filters by full name, contact number, or referring doctor (debounced, 300ms)
- **Status filter** - Toggle buttons: All | Active | Inactive | Discharged | Pending
- **Sortable table** - Columns: Name, Gender, Status, Assessment Date, Assigned Therapist, Actions
- **Pagination** - 20 patients per page, server-side pagination via search params

### URL Search Params
```
/patients?search=john&status=active&page=2&sort=fullName&order=asc
```

### Data Fetching
- Server Component fetches patient list using search params
- No client-side data fetching — all params passed to server queries

---

## 5. Patient Profile Page (`/patients/[id]`)

### Layout Sections
```
┌──────────────────────────────────────────────────────────────┐
│  Patient Header                                              │
│  [Avatar] Full Name | Gender | Status Badge | Quick Actions  │
│  Contact | Address | DOB | Occupation | Referring Doctor     │
├──────────────────────────────────────────────────────────────┤
│  Tabs:                                                       │
│  [Assessment] [Sessions] [Progress Notes] [Treatment Plan]   │
├──────────────────────────────────────────────────────────────┤
│  Tab Content:                                                │
│  - Assessment: Full PT assessment form (read-only view)      │
│  - Sessions: Calendar view + sortable session history table  │
│  - Progress Notes: Timeline of notes per session             │
│  - Treatment Plan: Active plan with frequency/duration       │
└──────────────────────────────────────────────────────────────┘
```

### Assessment Tab Subsections
```
┌──────────────────────────────────────────────────────────────┐
│  Assessment View                                             │
│  [Page 1] [Page 2]                                          │
├──────────────────────────────────────────────────────────────┤
│  Page 1 View:                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Medical History                                       │  │
│  │  ☑ Hypertension  ☐ Diabetes  ☐ Cardiovascular        │  │
│  │  ☐ Respiratory   ☐ Neurological ☑ Musculoskeletal    │  │
│  │  Surgeries: ACL reconstruction (2019)                 │  │
│  │  Medications: Lisinopril 10mg                         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Physical Examination                                  │  │
│  │  Posture: Forward head posture, rounded shoulders      │  │
│  │  Gait: Antalgic gait favoring left lower extremity     │  │
│  │  ROM: Left knee flexion 0-90° (limited)               │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Presenting Complaint          Pain: ████████░░ 8/10  │  │
│  │  Description: Left knee pain radiating to thigh...     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Page 2 View:                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Treatment Plan                                        │  │
│  │  Frequency: 3x/week | Duration: 45 min | 8 weeks     │  │
│  │  Start: 2026-01-15 | Time: Morning                    │  │
│  │  [View Calendar →]  [24 sessions auto-scheduled]       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Assessment Form Flow (`/patients/new` and `/patients/[id]/assessment`)

### Multi-Page Wizard
```
┌─────────────────────────────────────────────────────────────┐
│  STEP INDICATOR                                             │
│  [1. Patient Info] ── [2. Medical] ── [3. Exam] ── [...]   │
│       ●━━━━━━━━━━━━━○━━━━━━━━━━━━━○━━━━━━━━━━━━━○           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CURRENT STEP CONTENT                                       │
│  (Renders active step component)                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [← Previous]                            [Next →] / [Submit]│
└─────────────────────────────────────────────────────────────┘
```

### Step Breakdown
| Step | Component | Fields |
|------|-----------|--------|
| 1 | `PatientInfoStep` | Full name, address, DOB, gender, contact, occupation, hobbies, assessment date, referring doctor |
| 2 | `MedicalHistoryStep` | 6 checkboxes + 4 text fields |
| 3 | `PhysicalExamStep` | 7 text fields (posture, gait, ROM, strength, joints, neuro, special tests) |
| 4 | `PresentingComplaintStep` | 5 fields including pain scale slider |
| 5 | `FunctionalAssessmentStep` | 5 fields (ADLs, mobility, balance, devices, work) |
| 6 | `AssessmentSummaryStep` | 4 fields (impression, diagnosis, prognosis, goals) |
| 7 | `TreatmentPlanStep` | Frequency/duration picker + 5 text fields |
| 8 | `TherapistNotesStep` | 3 fields + therapist on duty signature block |

### Validation Strategy
- Each step validates with its sub-schema (`page1Schema` partial, `page2Schema` partial)
- Navigation blocked if current step has validation errors
- Full `assessmentSchema` validation on final submit
- Server Action re-validates entire form before database write

### Submission Flow
1. Client-side: step-by-step Zod validation on "Next"
2. Client-side: full schema validation on "Submit"
3. Server Action `createAssessment` receives validated `AssessmentInput`
4. Server Action re-validates with `assessmentSchema.safeParse()`
5. On success: creates Patient + Assessment + generates TherapySessions from `frequencyDuration`
6. Redirect to `/patients/[newId]`

---

## 7. Session Scheduler (Frequency/Duration → Calendar)

The `FrequencyDuration` input drives automatic session generation on the calendar.

### Input UI

```
┌──────────────────────────────────────────────────────────────┐
│  SESSION SCHEDULE                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Frequency:    [3x/week ▾]   Duration: [45 min ▾]          │
│  Total Weeks:  [8]            Time of Day: [Morning ▾]      │
│  Start Date:   [2026-01-15 📅]                               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PREVIEW: 24 sessions scheduled                        │  │
│  │                                                        │  │
│  │  Week 1: Jan 15 (Thu) · Jan 16 (Fri) · Jan 19 (Mon)  │  │
│  │  Week 2: Jan 22 (Thu) · Jan 23 (Fri) · Jan 26 (Mon)  │  │
│  │  Week 3: Jan 29 (Thu) · Jan 30 (Fri) · Feb 02 (Mon)  │  │
│  │  ...                                                   │  │
│  │  Week 8: Mar 12 (Thu) · Mar 13 (Fi) · Mar 16 (Mon)    │  │
│  │                                                        │  │
│  │  Total: 24 sessions × 45 min = 18 hours               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Session Generation Logic

```typescript
// lib/scheduler/generate-sessions.ts

import { type FrequencyDuration } from "@/types/patient";

interface GeneratedSession {
  scheduledAt: Date;            // Computed datetime
  durationMinutes: number;
  sessionNumber: number;        // 1-based index
}

function getSessionsPerWeek(frequency: string): number {
  const map: Record<string, number> = {
    "1x/week": 1,
    "2x/week": 2,
    "3x/week": 3,
    "5x/week": 5,
    daily: 7,
  };
  return map[frequency] ?? 1;
}

function getPreferredDayIndices(preferredTimeOfDay: string): number[] {
  // Returns preferred weekday indices (0=Mon..4=Fri) spread across the week
  // For 3x/week: Mon, Wed, Fri (0, 2, 4)
  // For 2x/week: Tue, Thu (1, 3)
  // For 1x/week: Wed (2)
  // etc.
  // ...
}

export function generateSessions(fd: FrequencyDuration): GeneratedSession[] {
  const sessions: GeneratedSession[] = [];
  const sessionsPerWeek = getSessionsPerWeek(fd.frequency);
  const startDate = new Date(fd.startDate);
  const preferredDays = getPreferredDayIndices(fd.preferredTimeOfDay);

  let sessionCount = 0;
  const totalSessions = sessionsPerWeek * fd.totalWeeks;

  for (let week = 0; week < fd.totalWeeks; week++) {
    for (let dayIdx = 0; dayIdx < sessionsPerWeek; dayIdx++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + week * 7 + preferredDays[dayIdx]);

      sessions.push({
        scheduledAt: sessionDate,
        durationMinutes: fd.durationMinutes,
        sessionNumber: ++sessionCount,
      });

      if (sessionCount >= totalSessions) return sessions;
    }
  }

  return sessions;
}
```

### Calendar Display

```
┌──────────────────────────────────────────────────────────────┐
│  SESSION CALENDAR                              ◀ Jan 2026 ▶  │
├──────────────────────────────────────────────────────────────┤
│  Mon     Tue     Wed     Thu     Fri     Sat     Sun         │
│  ─────── ─────── ─────── ─────── ─────── ─────── ───────     │
│                          1       2       3       4           │
│                                  │                           │
│  5       6       7       8       9       10      11          │
│                                  │           │               │
│  12      13      14      15●     16●     17      18          │
│                                  │       │                   │
│  19●     20      21      22●     23●     24      25          │
│  │                       │       │                           │
│  26●     27      28      29●     30●     31                  │
│  │                       │       │                           │
├──────────────────────────────────────────────────────────────┤
│  ● = Scheduled session (45 min)                              │
│  Click session → opens session detail / progress note form   │
└──────────────────────────────────────────────────────────────┘
```

### Auto-Scheduling on Assessment Save

When an assessment is saved with a valid `frequencyDuration`:

1. `generateSessions()` computes all session dates
2. Server Action creates `therapy_sessions` rows linked to the assessment
3. Dashboard schedule widget picks up new sessions automatically
4. Calendar view refreshes via `revalidatePath('/patients/[id]')`

---

## 8. DO's and DON'Ts

### DO's
- **DO** use Zod schemas for ALL form validation (client + server)
- **DO** sanitize free-text fields (medical history, notes) before storage
- **DO** log all patient data access for audit trail
- **DO** use UUID for all patient-related identifiers
- **DO** validate therapist license exists before accepting signature
- **DO** display loading states during data fetching
- **DO** show meaningful error messages for validation failures
- **DO** format phone numbers consistently: `+63 XXX XXX XXXX`
- **DO** use `dateOfBirth` (not age) for accurate age calculation
- **DO** store medical history as a structured JSONB object (not flat text)
- **DO** auto-generate sessions when `frequencyDuration` is saved
- **DO** show session preview before confirming assessment submission
- **DO** allow editing individual sessions after auto-generation

### DON'Ts
- **DON'T** store SSN or government ID numbers (Phase 1 scope excludes this)
- **DON'T** store passwords or authentication credentials in patient records
- **DON'T** use incremental IDs for patient identifiers (use UUIDs)
- **DON'T** allow assessment submission without required fields on active step
- **DON'T** display full medical history in list views (summary only)
- **DON'T** expose patient data in URL search params (use IDs only)
- **DON'T** use `localStorage` for patient data (sensitive, use server state)
- **DON'T** cache patient data in client-side state for more than one render cycle
- **DON'T** generate sessions for dates in the past
- **DON'T** allow session time overlaps (check existing sessions before generating)
- **DON'T** auto-generate more than 52 weeks of sessions (cap at 1 year)
