-- CreateEnum
CREATE TYPE "ReceiptPaymentMethod" AS ENUM ('CASH', 'TRANSFER');

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "paymentMethod" "ReceiptPaymentMethod" NOT NULL DEFAULT 'CASH';
