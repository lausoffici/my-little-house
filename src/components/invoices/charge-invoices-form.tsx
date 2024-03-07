'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckIcon, PlusCircleIcon, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useFormState } from 'react-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
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

  const [additionals, setAdditionals] = useState<{ id: string; value: number }[]>([]);
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
      paymentMethod: ReceiptPaymentMethod.CASH
    }
  });

  const { fields, append, remove } = useFieldArray<any>({
    control: form.control,
    name: 'invoices'
  });

  const formInvoices: { selectedId: string; amount: number }[] | undefined = form.getValues().invoices;

  const formInvoicesAmount = formInvoices?.map((invoice) => Number(invoice.amount));

  const total = useMemo(() => {
    const additionalsAmounts = additionals.map((input) => input.value);
    const totalAmounts = formInvoicesAmount ? [...formInvoicesAmount, ...additionalsAmounts] : additionalsAmounts;
    return totalAmounts.reduce((acc, current) => acc + current, 0);
  }, [additionals, formInvoicesAmount]);

  function getInvoicesOptions(invoiceId: string) {
    const selectedIds = formInvoices?.map(({ selectedId }) => Number(selectedId)) ?? [];

    return invoicesOptions.filter(
      (option) =>
        Number(option.value) !== selectedIds.find((id) => id === Number(option.value) && id !== Number(invoiceId))
    );
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

  function addAditional() {
    setAdditionals((prev) => {
      if (prev) {
        return [...prev, { id: uuid(), value: 0, label: '' }];
      } else {
        return [{ id: uuid(), value: 0, label: '' }];
      }
    });
  }

  const deleteAditional = (aditionalId: string) => {
    setAdditionals(additionals.filter((el) => el.id !== aditionalId));
  };

  const getInvoiceById = useCallback(
    (id: string) => {
      const invoice = unpaidInvoices.find((invoice) => invoice.id === Number(id));

      if (!invoice) throw new Error('Invoice not found');

      return invoice;
    },
    [unpaidInvoices]
  );

  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    const { value } = e.target;
    setAdditionals(additionals.map((aditional) => (aditional.id === id ? { ...aditional, label: value } : aditional)));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    const { value } = e.target;
    const numValue = Number(value);

    setAdditionals(
      additionals.map((aditional) => (aditional.id === id ? { ...aditional, value: numValue } : aditional))
    );
  }

  function handleSelect(index: number, id: string) {
    const invoice = getInvoiceById(id);
    const amount = getDiscountedAmount(invoice);

    form.setValue(`invoices.${index}.amount`, amount - invoice.balance);
  }

  return (
    <Form {...form}>
      <form className='space-y-3 py-3' action={action} id={CHARGE_INVOICE_FORM_ID}>
        <FormField
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modo de pago</FormLabel>
              <Select onValueChange={field.onChange} {...field}>
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
                    <Input
                      type='number'
                      placeholder='Importe'
                      defaultValue={0}
                      autoComplete='off'
                      {...fieldWithoutRef}
                      required
                    />
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
          onClick={() => append({ selectedId: undefined, amount: 0 })}
          disabled={fields.length === 10}
          className='flex items-center gap-2 w-[172px]'
          type='button'
        >
          <PlusCircleIcon width={15} />
          Agregar cuota
        </Button>
        <input type='hidden' name='studentId' value={studentId} />
        <input type='hidden' name='receiptTotal' value={total} />
        {additionals.length > 0
          ? additionals.map((aditional) => (
              <div className='flex gap-2' key={aditional.id}>
                <FormField
                  name='additional-description'
                  render={({ field: { ref, ...fieldWithoutRef } }) => (
                    <FormItem className='w-11/12'>
                      <Input
                        placeholder='Descripción'
                        autoComplete='off'
                        required
                        {...fieldWithoutRef}
                        onChange={(e) => handleDescriptionChange(e, aditional.id)}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  name='additional-amount'
                  render={({ field: { ref, ...fieldWithoutRef } }) => (
                    <FormItem>
                      <Input
                        type='number'
                        placeholder='Importe'
                        autoComplete='off'
                        {...fieldWithoutRef}
                        required
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, aditional.id)}
                      />
                    </FormItem>
                  )}
                />
                <Button variant='ghost' size='sm' onClick={() => deleteAditional(aditional.id)}>
                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </Button>
              </div>
            ))
          : null}
        <Button
          variant='secondary'
          onClick={addAditional}
          disabled={additionals.length === 10}
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
