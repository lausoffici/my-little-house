'use client';

import { useState } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { ScholarshipInvoiceDialog } from './scholarship-invoice-dialog';

interface ScholarshipInvoiceTriggerProps {
  invoiceFullDescription: string;
  invoiceId: number;
}

export default function ScholarshipInvoiceTrigger({
  invoiceFullDescription,
  invoiceId
}: ScholarshipInvoiceTriggerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className='w-full'>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Becar</DropdownMenuItem>
      </DialogTrigger>
      <ScholarshipInvoiceDialog
        onOpenChange={setOpenDialog}
        invoiceFullDescription={invoiceFullDescription}
        invoiceId={invoiceId}
      />
    </Dialog>
  );
}
