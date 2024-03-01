'use client';

import { ReceiptPaymentMethod } from '@prisma/client';
import { Vesper_Libre } from 'next/font/google';
import Image from 'next/image';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSearchParams } from '@/hooks/use-search-params';
import { getReceiptWithItemsById } from '@/lib/receipts';
import { formatCurrency, formateDate, padWithZeros } from '@/lib/utils';

import Logo from '../common/sidebar/logo';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

type ReceiptsDialogProps = {
  receipt: Awaited<ReturnType<typeof getReceiptWithItemsById>>;
};

const vesper = Vesper_Libre({
  subsets: ['latin'],
  weight: '400'
});

const paymentMethod = {
  [ReceiptPaymentMethod.CASH]: 'Efectivo',
  [ReceiptPaymentMethod.TRANSFER]: 'Transferencia'
};

export default function ReceiptDialog({ receipt }: ReceiptsDialogProps) {
  const receiptRef = useRef(null);
  const { setSearchParam, searchParams } = useSearchParams();

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  function handleOpen() {
    setSearchParam('receiptId', receipt?.id.toString() ?? '');
  }

  function handleClose() {
    setSearchParam('receiptId', '');
  }

  function onOpenChange(open: boolean) {
    if (open) handleOpen();
    else handleClose();
  }

  return (
    <Dialog open={searchParams.get('receiptId') === receipt.id.toString()} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprobante</DialogTitle>
        </DialogHeader>
        <Card ref={receiptRef} className='print:block print:m-2 print:scale-90'>
          <CardHeader>
            <div className='flex justify-between items-start text-sm font-semibold'>
              <span>{formateDate(receipt.createdAt)}</span>
              <div className='flex flex-col items-center font-medium'>
                <Logo />
                <h1>INGLÉS</h1>
              </div>
              <span>#{padWithZeros(receipt.id)}</span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className='p-6'>
            <div className='text-md mb-4'>
              <div>
                <span className='mr-2'>Estudiante:</span>
                <span className='font-semibold'>{`${receipt.student.firstName} ${receipt.student.lastName}`}</span>
              </div>
              <div>
                <span className='mr-2'>Método de pago:</span>
                <span className='font-semibold'>{paymentMethod[receipt.paymentMethod]}</span>
              </div>
            </div>
            <div className='flex justify-between py-2'>
              <span className='font-semibold'>Concepto</span>
              <span className='font-semibold'>Importe</span>
            </div>
            <div className='border-b-2 border-gray-600 w-full'></div>
            <div className='flex flex-col gap-2 py-2'>
              {receipt.items.map((item) => (
                <div key={item.id} className='flex justify-between gap-2'>
                  <span className='italic '>{item.description}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className='border-b-2 border-gray-600 w-full'></div>
            <div className='flex justify-between py-2'>
              <span className='font-bold'>TOTAL</span>
              <span className='font-semibold'>{formatCurrency(receipt.total)}</span>
            </div>
          </CardContent>
          <CardFooter className='flex justify-center items-center'>
            <div className={`border border-gray-500 py-1 px-3 ${vesper.className}`}>
              Enseñanza de calidad con calidez desde 1987
            </div>
          </CardFooter>
        </Card>
        <DialogFooter className='flex flex-row justify-between w-full '>
          <Button variant='outline' onClick={handleClose}>
            Cerrar
          </Button>
          <ReactToPrint
            trigger={() => <Button onClick={handlePrint}>Guardar/Imprimir</Button>}
            content={() => receiptRef.current}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
