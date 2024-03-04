-- CreateIndex
CREATE INDEX "CashRegisterInitialBalance_day_month_year_idx" ON "CashRegisterInitialBalance"("day", "month", "year");

-- CreateIndex
CREATE INDEX "Course_active_idx" ON "Course"("active");

-- CreateIndex
CREATE INDEX "Invoice_courseId_state_month_year_idx" ON "Invoice"("courseId", "state", "month" DESC, "year");

-- CreateIndex
CREATE INDEX "Invoice_studentId_state_idx" ON "Invoice"("studentId", "state");

-- CreateIndex
CREATE INDEX "Invoice_studentId_id_idx" ON "Invoice"("studentId", "id");

-- CreateIndex
CREATE INDEX "Invoice_studentId_courseId_state_idx" ON "Invoice"("studentId", "courseId", "state");

-- CreateIndex
CREATE INDEX "Receipt_createdAt_paymentMethod_idx" ON "Receipt"("createdAt" DESC, "paymentMethod");

-- CreateIndex
CREATE INDEX "Student_firstName_idx" ON "Student"("firstName");

-- CreateIndex
CREATE INDEX "Student_lastName_idx" ON "Student"("lastName");

-- CreateIndex
CREATE INDEX "StudentByCourse_studentId_idx" ON "StudentByCourse"("studentId");
