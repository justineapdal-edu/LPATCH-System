-- CreateTable
CREATE TABLE "Therapist" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "specialization" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Therapist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT,
    "occupation" TEXT,
    "hobbies" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "insuranceProvider" TEXT,
    "insurancePolicyNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalTherapyAssessment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "assessmentNumber" INTEGER NOT NULL DEFAULT 1,
    "patientInformation" JSONB NOT NULL,
    "medicalHistory" JSONB NOT NULL,
    "physicalExamination" JSONB NOT NULL,
    "presentingComplaint" JSONB NOT NULL,
    "functionalAssessment" JSONB NOT NULL,
    "assessmentSummary" JSONB NOT NULL,
    "treatmentPlan" JSONB NOT NULL,
    "therapistNotes" JSONB NOT NULL,
    "therapistOnDuty" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalTherapyAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapySession" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "therapistId" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "sessionType" TEXT NOT NULL DEFAULT 'treatment',
    "sessionNumber" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressNote" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "painLevel" INTEGER NOT NULL,
    "rangeOfMotion" TEXT,
    "functionalOutcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_licenseNumber_key" ON "Therapist"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_email_key" ON "Therapist"("email");

-- CreateIndex
CREATE INDEX "Therapist_fullName_idx" ON "Therapist"("fullName");

-- CreateIndex
CREATE INDEX "Patient_fullName_idx" ON "Patient"("fullName");

-- CreateIndex
CREATE INDEX "Patient_status_idx" ON "Patient"("status");

-- CreateIndex
CREATE INDEX "Patient_contactNumber_idx" ON "Patient"("contactNumber");

-- CreateIndex
CREATE INDEX "PhysicalTherapyAssessment_patientId_idx" ON "PhysicalTherapyAssessment"("patientId");

-- CreateIndex
CREATE INDEX "PhysicalTherapyAssessment_patientId_assessmentNumber_idx" ON "PhysicalTherapyAssessment"("patientId", "assessmentNumber");

-- CreateIndex
CREATE INDEX "PhysicalTherapyAssessment_createdAt_idx" ON "PhysicalTherapyAssessment"("createdAt");

-- CreateIndex
CREATE INDEX "TherapySession_patientId_idx" ON "TherapySession"("patientId");

-- CreateIndex
CREATE INDEX "TherapySession_therapistId_idx" ON "TherapySession"("therapistId");

-- CreateIndex
CREATE INDEX "TherapySession_assessmentId_idx" ON "TherapySession"("assessmentId");

-- CreateIndex
CREATE INDEX "TherapySession_scheduledAt_idx" ON "TherapySession"("scheduledAt");

-- CreateIndex
CREATE INDEX "TherapySession_status_idx" ON "TherapySession"("status");

-- CreateIndex
CREATE INDEX "TherapySession_therapistId_scheduledAt_idx" ON "TherapySession"("therapistId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressNote_sessionId_key" ON "ProgressNote"("sessionId");

-- CreateIndex
CREATE INDEX "ProgressNote_patientId_idx" ON "ProgressNote"("patientId");

-- CreateIndex
CREATE INDEX "ProgressNote_therapistId_idx" ON "ProgressNote"("therapistId");

-- CreateIndex
CREATE INDEX "ProgressNote_createdAt_idx" ON "ProgressNote"("createdAt");

-- AddForeignKey
ALTER TABLE "PhysicalTherapyAssessment" ADD CONSTRAINT "PhysicalTherapyAssessment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "PhysicalTherapyAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TherapySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
