-- CreateIndex
CREATE INDEX "EnrollmentYear_year_idx" ON "EnrollmentYear"("year");

-- CreateIndex
CREATE INDEX "StudentEnrollment_year_studentId_idx" ON "StudentEnrollment"("year", "studentId");
