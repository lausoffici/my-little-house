'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import domtoimage from 'dom-to-image';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';
import ReactToPrint from 'react-to-print';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from '@/hooks/use-search-params';
import { getReceiptWithItemsById } from '@/lib/receipts';
import { formatDate, padWithZeros } from '@/lib/utils';
import { receiptEmailFormSchema } from '@/lib/validations/form';

import ReceiptCard from './receipt-card';

type ReceiptsDialogProps = {
  receipt: Awaited<ReturnType<typeof getReceiptWithItemsById>>;
};

export const paymentMethodLabels = {
  [ReceiptPaymentMethod.CASH]: 'Efectivo',
  [ReceiptPaymentMethod.TRANSFER]: 'Transferencia'
};

export default function ReceiptDialog({ receipt }: ReceiptsDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { setSearchParam, searchParams } = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof receiptEmailFormSchema>>({
    resolver: zodResolver(receiptEmailFormSchema),
    defaultValues: {
      email: receipt?.student.email ?? ''
    }
  });

  const handlePrint = () => {
    window.print();
  };

  function handleOpen() {
    setSearchParam('receiptId', receipt?.id.toString() ?? '');
  }

  function handleClose() {
    setSearchParam('receiptId', '');
    form.reset();
  }

  function onOpenChange(open: boolean) {
    if (open) handleOpen();
    else handleClose();
  }

  async function copyToClipboardAsImage() {
    const element = receiptRef?.current;
    if (!element) return;

    try {
      const blobImage = await domtoimage.toBlob(element);

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blobImage
        })
      ]);
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }

  async function sendImageAsEmail({ email }: z.infer<typeof receiptEmailFormSchema>) {
    let element = receiptRef?.current;
    if (!element) return;

    try {
      const blobImage = await domtoimage.toBlob(element);

      // Convert blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blobImage);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Send the Base64 image in a POST request
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: base64data,
            email,
            studentId: receipt?.student.id
          })
        });

        if (res.ok) {
          toast({
            description: 'Email enviado correctamente',
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
          });
        } else {
          toast({
            description: 'Error al enviar email',
            icon: <ExclamationTriangleIcon width='20px' height='20px' />,
            variant: 'destructive'
          });
        }
      };
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      handleClose();
      router.refresh();
    }
  }

  if (!receipt) return null;

  const isSubmitting = form.formState.isSubmitting || (form.formState.isSubmitted && form.formState.isSubmitSuccessful);

  return (
    <Dialog open={searchParams.get('receiptId') === receipt.id.toString()} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprobante</DialogTitle>
        </DialogHeader>
        <ReceiptCard
          ref={receiptRef}
          date={formatDate(receipt.createdAt)}
          receiptNumber={padWithZeros(receipt.id)}
          studentName={`${receipt.student.firstName} ${receipt.student.lastName}`}
          paymentMethod={paymentMethodLabels[receipt.paymentMethod]}
          items={receipt.items}
          total={receipt.total}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(sendImageAsEmail)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className='flex gap-1'>
                    <FormControl>
                      <Input disabled={isSubmitting} placeholder='Ingrese un email' autoComplete='off' {...field} />
                    </FormControl>
                    <Button variant='outline' type='submit' disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className='animate-spin' height={16} /> : <FiSend className='mr-2' />}
                      {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='flex flex-row justify-between w-full mt-4'>
          <Button variant='outline' onClick={copyToClipboardAsImage}>
            Copiar
          </Button>
          <ReactToPrint
            trigger={() => <Button onClick={handlePrint}>Imprimir</Button>}
            content={() => receiptRef.current}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
