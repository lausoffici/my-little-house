'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { formatCurrency } from '@/lib/utils';
import { MonthlyReceipts } from '@/types';

export default function ReceiptsBarChart({ receipts }: { receipts: MonthlyReceipts[] }) {
  return (
    <ResponsiveContainer width='100%' height='100%' minHeight='384px'>
      <BarChart
        data={receipts}
        margin={{
          top: 5,
          right: 25,
          left: 25,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis className='text-xs' tickFormatter={formatCurrency} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            fill: '#f0f0f0'
          }}
        />
        <Legend content={<CustomLegend />} />
        <Bar dataKey='cash' fill='#8db5abff' />
        <Bar dataKey='transfer' fill='#f5c670' />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ payload }: TooltipProps<ValueType, NameType>) {
  if (!payload?.length) return null;

  return (
    <div className='flex flex-col gap-2 bg-gray-50 p-4 rounded-sm'>
      <div className='flex gap-2 text-sm'>
        <span>Efectivo: </span>
        <span>{formatCurrency(payload[0].payload.cash)}</span>
      </div>
      <div className='flex gap-2 text-sm'>
        <span>Transferencia: </span>
        <span>{formatCurrency(payload[1].payload.transfer)}</span>
      </div>
    </div>
  );
}

function CustomLegend({ payload }: TooltipProps<ValueType, NameType>) {
  return (
    <div className='w-full flex gap-2 justify-center mt-2'>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4' style={{ backgroundColor: payload?.[0].color }} />
        <span>Efectivo</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4' style={{ backgroundColor: payload?.[1].color }} />
        <span>Transferencia</span>
      </div>
    </div>
  );
}
