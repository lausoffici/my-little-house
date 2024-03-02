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

ALTER SEQUENCE "Student_id_seq" RESTART WITH 32713;

ALTER SEQUENCE "Course_id_seq" RESTART WITH 11089;

ALTER SEQUENCE "Additional_id_seq" RESTART WITH 41432;

ALTER SEQUENCE "EnrollmentYear_id_seq" RESTART WITH 1006;

ALTER SEQUENCE "Expenditure_id_seq" RESTART WITH 40734;

ALTER SEQUENCE "Invoice_id_seq" RESTART WITH 61388;

ALTER SEQUENCE "Item_id_seq" RESTART WITH 78877;

ALTER SEQUENCE "Receipt_id_seq" RESTART WITH 77138;

ALTER SEQUENCE "StudentEnrollment_id_seq" RESTART WITH 37494;
