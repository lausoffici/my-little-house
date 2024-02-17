-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_courseId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
