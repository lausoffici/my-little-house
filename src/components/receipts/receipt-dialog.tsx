'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import domtoimage from 'dom-to-image';
import { Loader2 } from 'lucide-react';
import { Vesper_Libre } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';
import ReactToPrint from 'react-to-print';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from '@/hooks/use-search-params';
import { getReceiptWithItemsById } from '@/lib/receipts';
import { formatCurrency, formatDate, padWithZeros } from '@/lib/utils';
import { receiptEmailFormSchema } from '@/lib/validations/form';

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
        <Card ref={receiptRef} className='print:shadow-none print:border-none print:max-h-[148mm] print:min-w-[105mm]'>
          <CardHeader className='p-3'>
            <div className='flex flex-col items-center w-full'>
              <Logo />
              <h1>INGLÉS</h1>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className='p-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-4'>
              <span>{formatDate(receipt.createdAt)}</span>
              <span>#{padWithZeros(receipt.id)}</span>
            </div>
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
            <div className='flex justify-between pb-1'>
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
            <div className='flex justify-between pt-2'>
              <span className='font-bold'>TOTAL</span>
              <span className='font-semibold'>{formatCurrency(receipt.total)}</span>
            </div>
          </CardContent>
          <CardFooter className='flex justify-center items-center p-2 pb-4 text-gray-600'>
            <div className={vesper.className}>Enseñanza de calidad con calidez desde 1987</div>
          </CardFooter>
        </Card>
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
