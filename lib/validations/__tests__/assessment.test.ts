import { describe, it, expect } from "vitest";
import { assessmentSchema, page1Schema, page2Schema } from "../assessment";

describe("assessmentSchema", () => {
  const validData = {
    patientInformation: {
      fullName: "John Doe",
      address: "123 Main St",
      dateOfBirth: "1990-01-15",
      gender: "male" as const,
      contactNumber: "555-1234",
      email: "",
      occupation: "",
      hobbies: "",
      dateOfAssessment: "2026-01-15",
      referringDoctor: "",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "555-5678",
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
      posture: "Normal",
      gait: "Normal",
      rangeOfMotion: "Full",
      muscleStrength: "5/5",
      jointIntegrity: "Stable",
      neurologicalScreening: "Intact",
      specialTests: "",
    },
    presentingComplaint: {
      description: "Left knee pain",
      onsetDuration: "2 weeks",
      aggravatingRelievingFactors: "Worsens with stairs",
      painScale: 6,
      functionalLimitations: "Difficulty climbing stairs",
    },
    functionalAssessment: {
      adls: "Independent",
      mobilityStatus: "Ambulatory",
      balanceCoordination: "Normal",
      assistiveDevices: "",
      workLimitations: "",
    },
    assessmentSummary: {
      clinicalImpression: "Left knee osteoarthritis",
      ptDiagnosis: "Knee OA",
      prognosis: "Good",
      goals: "Reduce pain, improve ROM",
    },
    treatmentPlan: {
      frequencyDuration: {
        frequency: "3x/week" as const,
        durationMinutes: 45 as const,
        totalWeeks: 8,
        preferredTimeOfDay: "morning" as const,
        startDate: "2026-01-15",
      },
      modalities: "",
      therapeuticExercises: "Quad sets, straight leg raises",
      manualTherapy: "",
      homeExerciseProgram: "Daily stretching",
      educationCounseling: "",
    },
    therapistNotes: {
      initialResponse: "",
      recommendations: "",
      followUpDate: "2026-02-15",
    },
    therapistOnDuty: {
      name: "Dr. Juan dela Cruz",
      licenseNumber: "PT-2024-00123",
      date: "2026-01-15",
      signatureBase64:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    },
  };

  it("accepts valid assessment data", () => {
    const result = assessmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects empty fullName", () => {
    const result = assessmentSchema.safeParse({
      ...validData,
      patientInformation: {
        ...validData.patientInformation,
        fullName: "",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = assessmentSchema.safeParse({
      ...validData,
      patientInformation: {
        ...validData.patientInformation,
        email: "not-an-email",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects pain scale > 10", () => {
    const result = assessmentSchema.safeParse({
      ...validData,
      presentingComplaint: {
        ...validData.presentingComplaint,
        painScale: 11,
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid signature format", () => {
    const result = assessmentSchema.safeParse({
      ...validData,
      therapistOnDuty: {
        ...validData.therapistOnDuty,
        signatureBase64: "not-a-png",
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty optional fields", () => {
    const result = assessmentSchema.safeParse({
      ...validData,
      patientInformation: {
        ...validData.patientInformation,
        email: "",
        occupation: "",
        hobbies: "",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("page1Schema", () => {
  it("validates page 1 fields only", () => {
    const result = page1Schema.safeParse({
      patientInformation: {
        fullName: "John",
        address: "123 Main",
        dateOfBirth: "1990-01-01",
        gender: "male",
        contactNumber: "555-1234",
        email: "",
        dateOfAssessment: "2026-01-15",
        emergencyContactName: "Jane",
        emergencyContactPhone: "555-5678",
      },
      medicalHistory: {
        hypertension: false,
        diabetes: false,
        cardiovascularDisease: false,
        respiratoryConditions: false,
        neurologicalDisorders: false,
        musculoskeletalInjuries: false,
      },
      physicalExamination: {
        posture: "Normal",
        gait: "Normal",
        rangeOfMotion: "Full",
        muscleStrength: "5/5",
        jointIntegrity: "Stable",
        neurologicalScreening: "Intact",
      },
      presentingComplaint: {
        description: "Pain",
        onsetDuration: "1 week",
        aggravatingRelievingFactors: "Activity",
        painScale: 5,
        functionalLimitations: "Walking",
      },
      functionalAssessment: {
        adls: "Independent",
        mobilityStatus: "Ambulatory",
        balanceCoordination: "Normal",
      },
    });
    expect(result.success).toBe(true);
  });
});
