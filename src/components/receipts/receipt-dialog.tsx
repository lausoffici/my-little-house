'use client';

import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSearchParams } from '@/hooks/use-search-params';
import { getReceiptWithItemsById } from '@/lib/receipts';

import { ReceiptCard } from './receipt-card';

type ReceiptsDialogProps = {
  receipt: Awaited<ReturnType<typeof getReceiptWithItemsById>>;
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
        <ReceiptCard ref={receiptRef} receipt={receipt} />
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
