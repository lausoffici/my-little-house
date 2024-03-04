'use client';

import { ReceiptPaymentMethod } from '@prisma/client';
import html2canvas from 'html2canvas';
import { Vesper_Libre } from 'next/font/google';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from '@/hooks/use-search-params';
import { getReceiptWithItemsById } from '@/lib/receipts';
import { formatCurrency, formatDate, padWithZeros } from '@/lib/utils';

import Logo from '../common/sidebar/logo';

type ReceiptsDialogProps = {
  receipt: Awaited<ReturnType<typeof getReceiptWithItemsById>>;
};

const vesper = Vesper_Libre({
  subsets: ['latin'],
  weight: '400'
});

export const paymentMethodLabels = {
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

  const copyToClipboardAsImage = async () => {
    const element = receiptRef?.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

      if (!blob) {
        console.error('Error creating blob');
        return;
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
    } catch (e) {
      console.error('Error copying image to clipboard', e);
    }
  };

  return (
    <Dialog open={searchParams.get('receiptId') === receipt.id.toString()} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprobante</DialogTitle>
        </DialogHeader>
        <Card ref={receiptRef} className='print:block print:m-2 print:scale-90'>
          <CardHeader>
            <div className='flex justify-between items-start text-sm font-semibold'>
              <span>{formatDate(receipt.createdAt)}</span>
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
                <span className='font-semibold'>{paymentMethodLabels[receipt.paymentMethod]}</span>
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
          <CardFooter className='flex justify-center items-center p-2 pb-4 text-gray-600'>
            <div className={vesper.className}>Enseñanza de calidad con calidez desde 1987</div>
          </CardFooter>
        </Card>
        <DialogFooter className='flex flex-row justify-between w-full'>
          <Button variant='outline' onClick={copyToClipboardAsImage}>
            Copiar
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
