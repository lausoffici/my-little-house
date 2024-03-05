-- CreateIndex
CREATE INDEX "Invoice_studentId_courseId_state_year_idx" ON "Invoice"("studentId", "courseId", "state", "year");
