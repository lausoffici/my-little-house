/*
  Warnings:

  - You are about to drop the `EnrollmentYear` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
ALTER TABLE IF EXISTS "EnrollmentYear" RENAME TO "Enrollment";

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_year_key" ON "Enrollment"("year");

-- CreateIndex
CREATE INDEX "Enrollment_year_idx" ON "Enrollment"("year" ASC);

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_year_fkey" FOREIGN KEY ("year") REFERENCES "Enrollment"("year") ON DELETE RESTRICT ON UPDATE CASCADE;
