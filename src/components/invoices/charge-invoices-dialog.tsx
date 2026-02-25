'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { PlusCircleIcon, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getUnpaidInvoicesByStudent } from '@/lib/invoices';
import { generateReceipt } from '@/lib/receipts';
import { formatCurrency, getMonthName } from '@/lib/utils';
import { getDiscountedAmount, getMonthsOverdue } from '@/lib/utils/invoices.utils';
import { receiptFormSchema } from '@/lib/validations/form';
import { Option } from '@/types';

import { SubmitButton } from '../submit-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

const initialState = {
  message: '',
  error: false,
  receipt: null
};
const CHARGE_INVOICE_FORM_ID = 'invoice-form';

interface ChargeInvoicesDialogProps {
  unpaidInvoicesPromise: ReturnType<typeof getUnpaidInvoicesByStudent>;
}

export default function ChargeInvoicesDialog({ unpaidInvoicesPromise }: ChargeInvoicesDialogProps) {
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [state, action] = useFormState(generateReceipt, initialState);
  const { id: studentId } = useParams<{ id: string }>();

  const unpaidInvoices = React.use(unpaidInvoicesPromise);

  const invoicesOptions: Option[] = unpaidInvoices.map((invoice) => ({
    value: String(invoice.id),
    label:
      invoice.month === 1
        ? invoice.description
        : `${invoice.description} - ${getMonthName(invoice.month)} ${invoice.year}`
  }));

  const form = useForm<z.infer<typeof receiptFormSchema>>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      paymentMethod: ReceiptPaymentMethod.CASH,
      invoices: [],
      additionals: [],
      studentId: '',
      receiptTotal: ''
    }
  });

  const {
    fields: invoiceFields,
    append: appendInvoice,
    remove: removeInvoice
  } = useFieldArray<z.infer<typeof receiptFormSchema>>({
    control: form.control,
    name: 'invoices'
  });

  const {
    fields: additionalFields,
    append: appendAdditional,
    remove: removeAdditional
  } = useFieldArray<z.infer<typeof receiptFormSchema>>({
    control: form.control,
    name: 'additionals'
  });

  const watchInvoices = form.watch('invoices');
  const watchAdditionals = form.watch('additionals');

  const invoices = invoiceFields.map((field, index) => {
    return {
      ...field,
      ...(watchInvoices ? watchInvoices[index] : {})
    };
  });

  const additionals = additionalFields.map((field, index) => {
    return {
      ...field,
      ...(watchAdditionals ? watchAdditionals[index] : {})
    };
  });

  type Surcharge = { invoiceIndex: number; displayDescription: string; receiptDescription: string; amount: number };

  const surcharges = useMemo<Surcharge[]>(() => {
    return invoices.flatMap((invoice, index) => {
      if (!invoice.selectedId) return [];
      const fullInvoice = unpaidInvoices.find(({ id }) => id === Number(invoice.selectedId));
      if (!fullInvoice) return [];
      const monthsOverdue = getMonthsOverdue(fullInvoice.month, fullInvoice.year);
      if (monthsOverdue === 0) return [];
      const baseAmount = getDiscountedAmount(fullInvoice.amount, fullInvoice.discount);
      const percentage = monthsOverdue * 10;
      return [
        {
          invoiceIndex: index,
          displayDescription: `Recargo ${percentage}%`,
          receiptDescription: `Recargo ${percentage}% - ${getMonthName(fullInvoice.month)} ${fullInvoice.year}`,
          amount: baseAmount * monthsOverdue * 0.1
        }
      ];
    });
  }, [invoices, unpaidInvoices]);

  const total = useMemo(() => {
    const totalInvoicesAmount = invoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0) ?? 0;
    const totalAdditionalsAmount = additionals.reduce((acc, additional) => acc + Number(additional.amount), 0) ?? 0;
    const totalSurchargesAmount = surcharges.reduce((acc, s) => acc + s.amount, 0);
    return totalInvoicesAmount + totalAdditionalsAmount + totalSurchargesAmount;
  }, [additionals, invoices, surcharges]);

  function getInvoicesOptions(invoiceId: string) {
    const selectedIds = invoices.map(({ selectedId }) => Number(selectedId));

    return invoicesOptions
      .filter((option) => {
        const invoiceOptionId = Number(option.value);
        const currentOptionId = Number(invoiceId);
        // returns all invoices options except the ones that are selected by others inputs
        return invoiceOptionId !== selectedIds.find((id) => id === invoiceOptionId && id !== currentOptionId);
      })
      .sort((a, b) => +a.value - +b.value);
  }

  useEffect(() => {
    if (state === undefined || state.message === '') return;

    if (state?.error) {
      toast({
        description: state?.message,
        icon: <ExclamationTriangleIcon width='20px' height='20px' />,
        variant: 'destructive'
      });
    } else {
      toast({
        description: state?.message,
        icon: <CheckIcon width='20px' height='20px' />,
        variant: 'success'
      });
      router.push(`/receipts?receiptId=${state.receipt?.id}`);
    }
  }, [router, state, toast]);

  // Fill amount field with the selected invoice discounted amount when select an invoice
  function handleSelect(index: number, selectedId: string) {
    const invoice = unpaidInvoices.find(({ id }) => id === Number(selectedId));

    if (!invoice) return;

    const { amount, balance, discount } = invoice;
    const discountedAmount = getDiscountedAmount(amount, discount);

    form.setValue(`invoices.${index}.amount`, discountedAmount - balance);
  }

  return (
    <Dialog open={openInvoiceDialog} onOpenChange={setOpenInvoiceDialog}>
      <DialogTrigger asChild>
        <Button size='sm'>Cobrar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cobrar cuota</DialogTitle>
          <DialogDescription>Seleccione el monto a cobrar</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-2 py-3' action={action} id={CHARGE_INVOICE_FORM_ID}>
            <FormField
              control={form.control}
              name='paymentMethod'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modo de pago</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                    <SelectTrigger className='w-[min(100%,180px)]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Metodos de pago</SelectLabel>
                        <SelectItem value={ReceiptPaymentMethod.CASH}>Efectivo</SelectItem>
                        <SelectItem value={ReceiptPaymentMethod.TRANSFER}>Transferencia</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {invoiceFields.map((invoice, index) => {
              return (
                <React.Fragment key={invoice.id}>
                  <div className='flex gap-2 items-center'>
                    <FormField
                      control={form.control}
                      name={`invoices.${index}.selectedId`}
                      render={({ field }) => (
                        <FormItem className='w-11/12'>
                          <FormLabel>Cuota</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleSelect(index, value);
                            }}
                            value={field.value}
                            name={field.name}
                          >
                            <SelectTrigger>
                              <SelectValue defaultValue={''} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Cuotas</SelectLabel>
                                {getInvoicesOptions(field.value).map(({ value, label }) => (
                                  <SelectItem key={value} value={value.toString()}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`invoices.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Importe</FormLabel>

                          <div className='flex items-center gap-1'>
                            <Input type='number' placeholder='Importe' autoComplete='off' {...field} value={field.value ?? ''} required />
                            <Button variant='ghost' size='sm' onClick={() => removeInvoice(index)}>
                              <X className='h-3 w-3 text-muted-foreground  hover:text-foreground' />
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  {(() => {
                    const surcharge = surcharges.find((s) => s.invoiceIndex === index);
                    if (!surcharge) return null;
                    return (
                      <div className='flex justify-between items-center text-sm text-muted-foreground pl-1 pr-12'>
                        <span>{surcharge.displayDescription}</span>
                        <span>{formatCurrency(surcharge.amount)}</span>
                      </div>
                    );
                  })()}
                </React.Fragment>
              );
            })}
            <Button
              variant='secondary'
              onClick={() => appendInvoice({ selectedId: '', amount: 0 })}
              disabled={invoiceFields.length === 5}
              className='flex items-center gap-2'
              type='button'
            >
              <PlusCircleIcon width={15} />
              Agregar cuota
            </Button>
            <input type='hidden' name='studentId' value={studentId} />
            <input type='hidden' name='receiptTotal' value={total.toString()} />

            {surcharges.map((surcharge, i) => (
              <React.Fragment key={`recargo-${i}`}>
                <input type='hidden' name={`recargos.${i}.description`} value={surcharge.receiptDescription} />
                <input type='hidden' name={`recargos.${i}.amount`} value={surcharge.amount.toString()} />
              </React.Fragment>
            ))}

            {additionalFields.map((additional, index) => (
              <div className='flex gap-2 items-center' key={additional.id}>
                <FormField
                  name={`additionals.${index}.description`}
                  render={({ field }) => (
                    <FormItem className='w-11/12'>
                      <FormLabel>Adicional</FormLabel>
                      <Input placeholder='Descripción' autoComplete='off' required {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`additionals.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Importe</FormLabel>
                      <div className='flex items-center gap-1'>
                        <Input type='number' placeholder='Importe' autoComplete='off' required {...field} />
                        <Button variant='ghost' size='sm' onClick={() => removeAdditional(index)}>
                          <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              variant='secondary'
              onClick={() => appendAdditional({ description: '', amount: 0 })}
              disabled={additionalFields.length === 5}
              className='flex items-center gap-2'
              type='button'
            >
              <PlusCircleIcon width={15} />
              Agregar adicional
            </Button>
            <div className='flex justify-between font-semibold mb-3'>
              <span>Total: </span>
              <span>{formatCurrency(total)}</span>
            </div>

            <DialogFooter>
              <Button variant='outline' onClick={() => setOpenInvoiceDialog(false)}>
                Cancelar
              </Button>
              <SubmitButton formId={CHARGE_INVOICE_FORM_ID} title='Cobrar' />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
