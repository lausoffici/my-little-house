-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_invoiceId_fkey";

ALTER SEQUENCE course_id_seq RESTART WITH 11076;