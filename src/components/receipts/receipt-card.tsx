import { Vesper_Libre } from 'next/font/google';
import React from 'react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

import Logo from '../common/sidebar/logo';

const vesper = Vesper_Libre({
  subsets: ['latin'],
  weight: '400'
});

export type ReceiptCardItem = {
  id: string | number;
  description: string;
  amount: number;
};

type ReceiptCardProps = {
  date: string;
  studentName: string;
  items: ReceiptCardItem[];
  total: number;
  receiptNumber?: string;
  paymentMethod?: string;
  title?: string;
  disclaimer?: string;
};

const ReceiptCard = React.forwardRef<HTMLDivElement, ReceiptCardProps>(function ReceiptCard(
  { date, studentName, items, total, receiptNumber, paymentMethod, title, disclaimer },
  ref
) {
  return (
    <Card ref={ref} className='print:shadow-none print:border-none print:max-h-[148mm] print:min-w-[105mm]'>
      <CardHeader className='p-3'>
        <div className='flex flex-col items-center w-full'>
          <Logo />
          <h1>INGLÉS</h1>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='p-4'>
        {title && <h2 className='text-center font-semibold uppercase mb-2'>{title}</h2>}
        <div className='flex justify-between text-sm text-gray-600 mb-4'>
          <span>{date}</span>
          {receiptNumber && <span>#{receiptNumber}</span>}
        </div>
        <div className='text-md mb-4'>
          <div>
            <span className='mr-2'>Estudiante:</span>
            <span className='font-semibold'>{studentName}</span>
          </div>
          {paymentMethod && (
            <div>
              <span className='mr-2'>Método de pago:</span>
              <span className='font-semibold'>{paymentMethod}</span>
            </div>
          )}
        </div>
        <div className='flex justify-between pb-1'>
          <span className='font-semibold'>Concepto</span>
          <span className='font-semibold'>Importe</span>
        </div>
        <div className='border-b-2 border-gray-600 w-full'></div>
        <div className='flex flex-col gap-2 py-2'>
          {items.map((item) => (
            <div key={item.id} className='flex justify-between gap-2'>
              <span className='italic '>{item.description}</span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
        <div className='border-b-2 border-gray-600 w-full'></div>
        <div className='flex justify-between pt-2'>
          <span className='font-bold'>TOTAL</span>
          <span className='font-semibold'>{formatCurrency(total)}</span>
        </div>
        {disclaimer && <p className='text-xs text-center text-gray-600 mt-4'>{disclaimer}</p>}
      </CardContent>
      <CardFooter className='flex justify-center items-center p-2 pb-4 text-gray-600'>
        <div className={vesper.className}>Enseñanza de calidad con calidez desde 1987</div>
      </CardFooter>
    </Card>
  );
});

export default ReceiptCard;
