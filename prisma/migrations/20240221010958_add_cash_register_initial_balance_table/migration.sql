-- CreateTable
CREATE TABLE "CashRegisterInitialBalance" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "CashRegisterInitialBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CashRegisterInitialBalance_year_month_day_key" ON "CashRegisterInitialBalance"("year", "month", "day");

ALTER SEQUENCE "Student_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "Course_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "Additional_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "EnrollmentYear_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "Expenditure_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "Invoice_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "Item_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "Receipt_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "StudentByCourse_id_seq" RESTART WITH 70000;

ALTER SEQUENCE "StudentEnrollment_id_seq" RESTART WITH 70000;
