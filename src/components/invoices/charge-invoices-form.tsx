'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckIcon, PlusCircleIcon, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
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

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [additionals, setAdditionals] = useState<{ id: string; value: number }[]>([]);
  const [state, action] = useFormState(generateReceipt, initialState);
  const { id: studentId } = useParams<{ id: string }>();

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

  const unpaidInvoices = React.use(unpaidInvoicesPromise);

  const invoicesOptions: Option[] = unpaidInvoices.map((invoice) => ({
    value: String(invoice.id),
    label: `${invoice.description} - ${getMonthName(invoice.month)} ${invoice.year} ${formatCurrency(invoice.amount)}`
  }));

  const form = useForm<z.infer<typeof invoicesFormSchema>>({
    resolver: zodResolver(invoicesFormSchema),
    defaultValues: {
      paymentMethod: ReceiptPaymentMethod.CASH
    }
  });

  function addAditional() {
    setAdditionals((prev) => {
      if (prev) {
        return [...prev, { id: uuid(), value: 0, label: '' }];
      } else {
        return [{ id: uuid(), value: 0, label: '' }];
      }
    });
  }

  const deleteAditional = (aditional: string) => {
    setAdditionals(additionals.filter((el) => el.id !== aditional));
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

  const total = useMemo(() => {
    const selectedInvoicesAmount = selectedInvoiceIds.map(getInvoiceById).map((invoice) => invoice.amount);
    const additionalsAmounts = additionals.map((input) => input.value);
    const totalAmounts = [...selectedInvoicesAmount, ...additionalsAmounts];

    const total = totalAmounts.reduce((acc, current) => acc + current, 0);

    return total;
  }, [additionals, getInvoiceById, selectedInvoiceIds]);

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
                <SelectTrigger className='w-[180px]'>
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
        <FormField
          control={form.control}
          name='invoices'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuotas Impagas</FormLabel>
              <MultiSelect
                className='w-[462px]'
                options={invoicesOptions}
                selected={selectedInvoiceIds}
                notFoundMessage='Cuota no encontrada'
                {...field}
                onChange={setSelectedInvoiceIds}
                name='invoices'
              />
            </FormItem>
          )}
        />
        <input type='hidden' name='studentId' value={studentId} />
        <input type='hidden' name='receiptTotal' value={total} />
        {additionals.length > 0
          ? additionals.map((aditional) => (
              <div className='flex gap-2' key={aditional.id}>
                <FormField
                  name={`additional-description`}
                  render={({ field }) => (
                    <FormItem className='w-11/12'>
                      <Input
                        placeholder='Descripción'
                        autoComplete='off'
                        required
                        {...field}
                        onChange={(e) => handleDescriptionChange(e, aditional.id)}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  name='additional-amount'
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        type='number'
                        placeholder='$ valor'
                        autoComplete='off'
                        {...field}
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
