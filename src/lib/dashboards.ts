'use server';

import { ReceiptPaymentMethod } from '@prisma/client';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { getYearMonthDayFromSearchParams } from './utils/cash-register.utils';
import { dashboardSearchParamsSchema } from './validations/params';

export const getDashboard = async (searchParams: SearchParams) => {
  const params = dashboardSearchParamsSchema.parse(searchParams);
  const { dayNumber, monthNumber, yearNumber } = getYearMonthDayFromSearchParams(params);

  const startDate = new Date(yearNumber, monthNumber - 1, dayNumber);
  const endDate = new Date(yearNumber, monthNumber - 1, dayNumber + 1);

  const whereClause = {
    createdAt: {
      gte: startDate,
      lt: endDate
    }
  };

  const cashAggregate = await prisma.receipt.aggregate({
    _sum: {
      total: true
    },
    where: { ...whereClause, paymentMethod: ReceiptPaymentMethod.CASH }
  });

  const transferAggregate = await prisma.receipt.aggregate({
    _sum: {
      total: true
    },
    where: { ...whereClause, paymentMethod: ReceiptPaymentMethod.TRANSFER }
  });

  const receiptsCount = await prisma.receipt.count({
    where: whereClause
  });

  const expenditureAggregate = await prisma.expenditure.aggregate({
    _sum: {
      amount: true
    },
    where: whereClause
  });

  const cashRegisterInitialBalance = await prisma.cashRegisterInitialBalance.findFirst({
    where: {
      day: dayNumber,
      month: monthNumber,
      year: yearNumber
    }
  });

  const totalCash = cashAggregate._sum.total ?? 0;
  const totalTransfer = transferAggregate._sum.total ?? 0;
  const totalAmount = totalCash + totalTransfer;
  const totalExpenditure = expenditureAggregate._sum.amount ?? 0;
  const initialBalance = cashRegisterInitialBalance?.balance ?? 0;
  const currentBalance = initialBalance + totalCash - totalExpenditure;

  return {
    totalCash,
    totalTransfer,
    totalAmount,
    receiptsCount,
    totalExpenditure,
    currentBalance
  };
};
