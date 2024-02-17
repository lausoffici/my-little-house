/*
  Warnings:

  - You are about to drop the column `number` on the `Invoice` table. All the data in the column will be lost.
  - The `state` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `courseId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseId,studentId]` on the table `StudentByCourse` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentId` on table `Additional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Additional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Additional` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `EnrollmentYear` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `EnrollmentYear` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `month` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `balance` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiredAt` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiptId` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `Receipt` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `StudentByCourse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `StudentByCourse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `StudentEnrollment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `StudentEnrollment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InvoiceState" AS ENUM ('I', 'P', 'B');

-- DropForeignKey
ALTER TABLE "Additional" DROP CONSTRAINT "Additional_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_receiptId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentByCourse" DROP CONSTRAINT "StudentByCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentByCourse" DROP CONSTRAINT "StudentByCourse_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentEnrollment" DROP CONSTRAINT "StudentEnrollment_studentId_fkey";

-- AlterTable
ALTER TABLE "Additional" ALTER COLUMN "studentId" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT 'Sin Descripción',
ALTER COLUMN "amount" SET NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Sin Nombre',
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "EnrollmentYear" ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;

-- AlterTable
ALTER TABLE "Expenditure" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT 'Sin Descripción',
ALTER COLUMN "amount" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "number",
ADD COLUMN     "month" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "balance" SET NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0,
DROP COLUMN "state",
ADD COLUMN     "state" "InvoiceState" NOT NULL DEFAULT 'I',
ALTER COLUMN "expiredAt" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "studentId" SET NOT NULL,
ALTER COLUMN "courseId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT 'Sin Descripción',
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "receiptId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "studentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "courseId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudentByCourse" ALTER COLUMN "courseId" SET NOT NULL,
ALTER COLUMN "studentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "StudentEnrollment" ALTER COLUMN "studentId" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentByCourse_courseId_studentId_key" ON "StudentByCourse"("courseId", "studentId");

-- AddForeignKey
ALTER TABLE "StudentByCourse" ADD CONSTRAINT "StudentByCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentByCourse" ADD CONSTRAINT "StudentByCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Additional" ADD CONSTRAINT "Additional_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add a check constraint to ensure at least one of the columns is not null
ALTER TABLE "Item"
ADD CONSTRAINT at_least_one_not_null
CHECK (("invoiceId" IS NOT NULL) OR ("additionalId" IS NOT NULL));

-- Add a partial index to optimize the check constraint
CREATE INDEX idx_at_least_one_not_null
ON "Item" (id)
WHERE (("invoiceId" IS NOT NULL) OR ("additionalId" IS NOT NULL));