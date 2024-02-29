'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckIcon, PlusCircleIcon, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { getUnpaidInvoicesByStudent } from '@/lib/invoices';
import { generateReceipt } from '@/lib/receipts';
import { formatCurrency, getMonthName } from '@/lib/utils';
import { invoicesFormSchema } from '@/lib/validations/form';
import { Option } from '@/types';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MultiSelect } from '../ui/multi-select';
import { useToast } from '../ui/use-toast';

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
    const [additionals, setAdditionals] = useState<{ id: string; value: number }[]>([]);
    const [selectedIds, setSelected] = useState<string[]>([]);
    const [state, action] = useFormState(generateReceipt, initialState);
    const { id: studentId } = useParams<{ id: string }>();
    const { toast } = useToast();
    const router = useRouter();

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
        defaultValues: {}
    });

    function handleAditional() {
        setAdditionals((prev) => {
            if (prev) {
                return [...prev, { id: uuid(), value: 0, label: '' }];
            } else {
                return [{ id: uuid(), value: 0, label: '' }];
            }
        });
    }

    const handleDeleteAditional = (aditional: string) => {
        const filteredAditionals = additionals?.filter((el) => el.id !== aditional);
        if (filteredAditionals) setAdditionals(filteredAditionals);
    };

    const getInvoiceById = (id: string) => {
        const invoice = unpaidInvoices.find((invoice) => invoice.id === Number(id));

        if (!invoice) throw new Error('Invoice not found');

        return invoice;
    };

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>, id: string) {
        const { value } = e.target;
        setAdditionals(
            additionals.map((aditional) => (aditional.id === id ? { ...aditional, label: value } : aditional))
        );
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, id: string) {
        const { value } = e.target;
        const numValue = Number(value);

        setAdditionals(
            additionals.map((aditional) => (aditional.id === id ? { ...aditional, value: numValue } : aditional))
        );
    }

    function getTotal() {
        if (selectedIds.length > 0 || additionals.length > 0) {
            const selectedInvoicesAmount = selectedIds.map(getInvoiceById).map((invoice) => invoice.amount);
            const additionalsAmounts = additionals.map((input) => input.value);
            const totalAmounts = [...selectedInvoicesAmount, ...additionalsAmounts];

            const total = totalAmounts.reduce((acc, current) => acc + current, 0);

            return total;
        }

        return 0;
    }

    return (
        <Form {...form}>
            <form className='space-y-3 py-3' action={action} id={CHARGE_INVOICE_FORM_ID}>
                <FormField
                    control={form.control}
                    name='invoices'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cuotas Impagas</FormLabel>
                            <MultiSelect
                                className='w-[462px]'
                                options={invoicesOptions}
                                selected={selectedIds}
                                notFoundMessage='Cuota no encontrada'
                                {...field}
                                onChange={setSelected}
                                name='invoices'
                            />
                        </FormItem>
                    )}
                />
                <input type='hidden' name='studentId' value={studentId} />
                <input type='hidden' name='receiptTotal' value={getTotal()} />
                {additionals && additionals.length > 0
                    ? additionals?.map((aditional) => (
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
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                  handleInputChange(e, aditional.id)
                                              }
                                          />
                                      </FormItem>
                                  )}
                              />
                              <Button variant='ghost' size='sm' onClick={() => handleDeleteAditional(aditional.id)}>
                                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                              </Button>
                          </div>
                      ))
                    : null}
                <Button
                    variant='secondary'
                    onClick={handleAditional}
                    disabled={additionals?.length === 10 ? true : false}
                    className='flex items-center gap-2'
                    type='button'
                >
                    <PlusCircleIcon width={15} />
                    Agregar adicional
                </Button>
                <div className='px-1'>
                    <div className='w-full flex justify-between font-semibold'>
                        <span>Total: </span>
                        <span>{formatCurrency(getTotal())}</span>
                    </div>
                </div>
            </form>
        </Form>
    );
}
