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
