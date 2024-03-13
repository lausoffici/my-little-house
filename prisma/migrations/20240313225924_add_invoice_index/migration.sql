-- AlterTable
ALTER TABLE "Enrollment" RENAME CONSTRAINT "EnrollmentYear_pkey" TO "Enrollment_pkey";

-- CreateIndex
CREATE INDEX "Invoice_state_expiredAt_idx" ON "Invoice"("state", "expiredAt");
