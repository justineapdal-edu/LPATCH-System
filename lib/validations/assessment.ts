import { z } from "zod";

// ── Page 1: Patient Information ─────────────────────────────────

const patientInformationSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Gender is required",
  }),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  occupation: z.string().max(100).optional(),
  hobbies: z.string().max(200).optional(),
  dateOfAssessment: z.string().min(1, "Date of assessment is required"),
  referringDoctor: z.string().max(100).optional(),
  emergencyContactName: z
    .string()
    .min(1, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(1, "Emergency contact phone is required"),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
});

// ── Page 1: Medical History ─────────────────────────────────────

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

// ── Page 1: Physical Examination ────────────────────────────────

const physicalExaminationSchema = z.object({
  posture: z.string().min(1, "Posture assessment is required"),
  gait: z.string().min(1, "Gait assessment is required"),
  rangeOfMotion: z.string().min(1, "Range of motion is required"),
  muscleStrength: z
    .string()
    .min(1, "Muscle strength assessment is required"),
  jointIntegrity: z
    .string()
    .min(1, "Joint integrity assessment is required"),
  neurologicalScreening: z
    .string()
    .min(1, "Neurological screening is required"),
  specialTests: z.string().optional(),
});

// ── Page 1: Presenting Complaint ────────────────────────────────

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

// ── Page 1: Functional Assessment ───────────────────────────────

const functionalAssessmentSchema = z.object({
  adls: z.string().min(1, "ADL assessment is required"),
  mobilityStatus: z.string().min(1, "Mobility status is required"),
  balanceCoordination: z
    .string()
    .min(1, "Balance/coordination assessment is required"),
  assistiveDevices: z.string().optional(),
  workLimitations: z.string().optional(),
});

// ── Page 2: Assessment Summary ──────────────────────────────────

const assessmentSummarySchema = z.object({
  clinicalImpression: z.string().min(1, "Clinical impression is required"),
  ptDiagnosis: z.string().min(1, "PT diagnosis is required"),
  prognosis: z.string().min(1, "Prognosis is required"),
  goals: z.string().min(1, "Treatment goals are required"),
});

// ── Page 2: Treatment Plan (Frequency & Duration) ───────────────

const frequencyDurationSchema = z.object({
  frequency: z.enum(["1x/week", "2x/week", "3x/week", "5x/week", "daily"], {
    message: "Session frequency is required",
  }),
  durationMinutes: z.number().refine(
    (v) => [30, 45, 60, 90].includes(v),
    { message: "Session duration is required" }
  ),
  totalWeeks: z
    .number()
    .int()
    .min(1, "Must be at least 1 week")
    .max(52, "Cannot exceed 52 weeks"),
  preferredTimeOfDay: z.enum(
    ["morning", "afternoon", "evening", "any"],
    { message: "Preferred time of day is required" }
  ),
  startDate: z.string().min(1, "Start date is required"),
});

const treatmentPlanSchema = z.object({
  frequencyDuration: frequencyDurationSchema,
  modalities: z.string().optional(),
  therapeuticExercises: z
    .string()
    .min(1, "Therapeutic exercises are required"),
  manualTherapy: z.string().optional(),
  homeExerciseProgram: z
    .string()
    .min(1, "Home exercise program is required"),
  educationCounseling: z.string().optional(),
});

// ── Page 2: Therapist Notes ─────────────────────────────────────

const therapistNotesSchema = z.object({
  initialResponse: z.string().optional(),
  recommendations: z.string().optional(),
  followUpDate: z.string().min(1, "Follow-up date is required"),
});

// ── Page 2: Therapist on Duty ───────────────────────────────────

const therapistOnDutySchema = z.object({
  name: z.string().min(1, "Therapist name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  date: z.string().min(1, "Date is required"),
  signatureBase64: z
    .string()
    .min(1, "Signature is required")
    .refine((val) => val.startsWith("data:image/png;base64,"), {
      message: "Signature must be a valid PNG image",
    }),
});

// ── Root Schema ─────────────────────────────────────────────────

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

// ── Individual page schemas for step-by-step validation ─────────

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
