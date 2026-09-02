-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isDebtor" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Student_isDebtor_idx" ON "Student"("isDebtor");
