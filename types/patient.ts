export const PatientStatus = {
  Pending: "pending",
  Active: "active",
  Inactive: "inactive",
  Discharged: "discharged",
} as const;

export type PatientStatus = (typeof PatientStatus)[keyof typeof PatientStatus];

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
  PreferNotToSay: "prefer_not_to_say",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

// ── Therapist ───────────────────────────────────────────────────

export interface Therapist {
  id: string;
  fullName: string;
  licenseNumber: string;
  email?: string | null;
  phone?: string | null;
  specialization?: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// ── Patient Information ─────────────────────────────────────────

export interface PatientInformation {
  fullName: string;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  contactNumber: string;
  email?: string;
  occupation?: string;
  hobbies?: string;
  dateOfAssessment: string;
  referringDoctor?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

// ── Medical History ─────────────────────────────────────────────

export interface MedicalHistory {
  hypertension: boolean;
  diabetes: boolean;
  cardiovascularDisease: boolean;
  respiratoryConditions: boolean;
  neurologicalDisorders: boolean;
  musculoskeletalInjuries: boolean;
  surgeries?: string;
  medications?: string;
  allergies?: string;
  otherHistory?: string;
}

// ── Physical Examination ────────────────────────────────────────

export interface PhysicalExamination {
  posture: string;
  gait: string;
  rangeOfMotion: string;
  muscleStrength: string;
  jointIntegrity: string;
  neurologicalScreening: string;
  specialTests?: string;
}

// ── Presenting Complaint ────────────────────────────────────────

export interface PresentingComplaint {
  description: string;
  onsetDuration: string;
  aggravatingRelievingFactors: string;
  painScale: number;
  functionalLimitations: string;
}

// ── Functional Assessment ───────────────────────────────────────

export interface FunctionalAssessment {
  adls: string;
  mobilityStatus: string;
  balanceCoordination: string;
  assistiveDevices?: string;
  workLimitations?: string;
}

// ── Assessment Summary ──────────────────────────────────────────

export interface AssessmentSummary {
  clinicalImpression: string;
  ptDiagnosis: string;
  prognosis: string;
  goals: string;
}

// ── Treatment Plan ──────────────────────────────────────────────

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
  durationMinutes: number;
  totalWeeks: number;
  preferredTimeOfDay: "morning" | "afternoon" | "evening" | "any";
  startDate: string;
}

export interface TreatmentPlan {
  frequencyDuration: FrequencyDuration;
  modalities?: string;
  therapeuticExercises: string;
  manualTherapy?: string;
  homeExerciseProgram: string;
  educationCounseling?: string;
}

// ── Therapist Notes ─────────────────────────────────────────────

export interface TherapistNotes {
  initialResponse?: string;
  recommendations?: string;
  followUpDate: string;
}

// ── Therapist on Duty ───────────────────────────────────────────

export interface TherapistOnDuty {
  name: string;
  licenseNumber: string;
  date: string;
  signatureBase64: string;
}

// ── Root Assessment ─────────────────────────────────────────────

export interface PhysicalTherapyAssessment {
  id: string;
  patientId: string;
  assessmentNumber: number;

  patientInformation: PatientInformation;
  medicalHistory: MedicalHistory;
  physicalExamination: PhysicalExamination;
  presentingComplaint: PresentingComplaint;
  functionalAssessment: FunctionalAssessment;

  assessmentSummary: AssessmentSummary;
  treatmentPlan: TreatmentPlan;
  therapistNotes: TherapistNotes;
  therapistOnDuty: TherapistOnDuty;
  notes?: string | null;

  createdAt: string;
  updatedAt: string;
}

// ── Therapy Session ─────────────────────────────────────────────

export const SessionStatus = {
  Scheduled: "scheduled",
  Completed: "completed",
  Cancelled: "cancelled",
  NoShow: "no_show",
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export const SessionType = {
  Evaluation: "evaluation",
  Treatment: "treatment",
  FollowUp: "follow_up",
  Discharge: "discharge",
} as const;

export type SessionType = (typeof SessionType)[keyof typeof SessionType];

export interface TherapySession {
  id: string;
  patientId: string;
  assessmentId: string;
  therapistId: string | null;
  scheduledAt: string;
  durationMinutes: number;
  status: SessionStatus;
  sessionType: SessionType;
  sessionNumber: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Progress Note ───────────────────────────────────────────────

export interface ProgressNote {
  id: string;
  sessionId: string;
  patientId: string;
  therapistId: string;
  content: string;
  painLevel: number;
  rangeOfMotion?: string;
  functionalOutcome?: string;
  createdAt: string;
}
