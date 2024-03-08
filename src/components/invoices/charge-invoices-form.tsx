'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckIcon, PlusCircleIcon, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import React from 'react';
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
import { getDiscountedAmount } from '@/lib/utils/invoices.utils';
import { receiptFormSchema } from '@/lib/validations/form';
import { Option } from '@/types';

const initialState = {
  message: '',
  error: false,
  receipt: null
};

export const CHARGE_INVOICE_FORM_ID = 'invoice-form';

interface ChargeInvoicesFormProps {
  unpaidInvoicesPromise: ReturnType<typeof getUnpaidInvoicesByStudent>;
}

export default function ChargeInvoicesForm({ unpaidInvoicesPromise }: ChargeInvoicesFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [state, action] = useFormState(generateReceipt, initialState);
  const { id: studentId } = useParams<{ id: string }>();

  const unpaidInvoices = React.use(unpaidInvoicesPromise);

  const invoicesOptions: Option[] = unpaidInvoices.map((invoice) => ({
    value: String(invoice.id),
    label: `${invoice.description} - ${getMonthName(invoice.month)} ${invoice.year}`
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

  const { fields, append, remove } = useFieldArray<z.infer<typeof receiptFormSchema>>({
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

  const getForms = useMemo(() => {
    const formInvoices: { selectedId: string; amount: number }[] = form.getValues().invoices ?? [];
    const formAdditionals: { description: string; amount: number }[] = form.getValues().additionals ?? [];
    return { formInvoices, formAdditionals };
  }, [form]);

  const total = useMemo(() => {
    const { formInvoices, formAdditionals } = getForms;
    const formInvoicesAmount = formInvoices?.map((invoice) => Number(invoice.amount));
    const additionalsAmounts = formAdditionals?.map((additional) => Number(additional.amount));
    const totalAmounts = formInvoicesAmount ? [...formInvoicesAmount, ...additionalsAmounts] : additionalsAmounts;

    return totalAmounts.reduce((acc, current) => acc + current, 0);
  }, [getForms]);

  function getInvoicesOptions(invoiceId: string) {
    const { formInvoices } = getForms;
    const selectedIds = formInvoices?.map(({ selectedId }) => Number(selectedId)) ?? [];

    return invoicesOptions.filter((option) => {
      const invoiceOptionId = Number(option.value);
      const currentOptionId = Number(invoiceId);
      // returns all invoices options except the ones that are selected by others inputs
      return invoiceOptionId !== selectedIds.find((id) => id === invoiceOptionId && id !== currentOptionId);
    });
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

  const getInvoiceById = useCallback(
    (id: string) => {
      return unpaidInvoices.find((invoice) => invoice.id === Number(id));
    },
    [unpaidInvoices]
  );

  function handleSelect(index: number, id: string) {
    const invoice = getInvoiceById(id);
    if (!invoice) return;
    const amount = getDiscountedAmount(invoice.amount, invoice.discount);

    form.setValue(`invoices.${index}.amount`, amount - invoice.balance);
  }

  return (
    <Form {...form}>
      <form className='space-y-3 py-3' action={action} id={CHARGE_INVOICE_FORM_ID}>
        <FormField
          control={form.control}
          name='paymentMethod'
          render={({ field: { ref, ...fieldWithoutRef } }) => (
            <FormItem>
              <FormLabel>Modo de pago</FormLabel>
              <Select onValueChange={fieldWithoutRef.onChange} {...fieldWithoutRef}>
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
        {fields.map((invoice, index) => {
          return (
            <div className='flex gap-2 items-center' key={invoice.id}>
              <FormField
                control={form.control}
                name={`invoices.${index}.selectedId`}
                render={({ field: { ref, ...fieldWithoutRef } }) => (
                  <FormItem className='w-11/12'>
                    <Select
                      onValueChange={(value) => {
                        fieldWithoutRef.onChange(value);
                        handleSelect(index, value);
                      }}
                      {...fieldWithoutRef}
                    >
                      <SelectTrigger>
                        <SelectValue defaultValue={''} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cursos</SelectLabel>
                          {getInvoicesOptions(fieldWithoutRef.value).map(({ value, label }) => (
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
                render={({ field: { ref, ...fieldWithoutRef } }) => (
                  <FormItem>
                    <Input type='number' placeholder='Importe' autoComplete='off' {...fieldWithoutRef} required />
                  </FormItem>
                )}
              />

              <Button variant='ghost' size='sm' onClick={() => remove(index)}>
                <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
              </Button>
            </div>
          );
        })}
        <Button
          variant='secondary'
          onClick={() => append({ selectedId: '', amount: 0 })}
          disabled={fields.length === 5}
          className='flex items-center gap-2 w-[172px]'
          type='button'
        >
          <PlusCircleIcon width={15} />
          Agregar cuota
        </Button>
        <input type='hidden' name='studentId' value={studentId} />
        <input type='hidden' name='receiptTotal' value={total.toString()} />

        {additionalFields.map((additional, index) => (
          <div className='flex gap-2' key={additional.id}>
            <FormField
              name={`additionals.${index}.description`}
              render={({ field: { ref, ...fieldWithoutRef } }) => (
                <FormItem className='w-11/12'>
                  <Input placeholder='Descripción' autoComplete='off' required {...fieldWithoutRef} />
                </FormItem>
              )}
            />
            <FormField
              name={`additionals.${index}.amount`}
              render={({ field: { ref, ...fieldWithoutRef } }) => (
                <FormItem>
                  <Input type='number' placeholder='Importe' autoComplete='off' required {...fieldWithoutRef} />
                </FormItem>
              )}
            />
            <Button variant='ghost' size='sm' onClick={() => removeAdditional(index)}>
              <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
            </Button>
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
      </form>
      <div className='flex justify-between font-semibold mb-3'>
        <span>Total: </span>
        <span>{formatCurrency(total)}</span>
      </div>
    </Form>
  );
}
