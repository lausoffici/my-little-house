'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import domtoimage from 'dom-to-image';
import { PlusCircleIcon, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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

import ReceiptCard, { ReceiptCardItem } from '../receipts/receipt-card';
import { paymentMethodLabels } from '../receipts/receipt-dialog';
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

type Step = 'form' | 'detail' | 'confirm';

interface ChargeInvoicesDialogProps {
  unpaidInvoicesPromise: ReturnType<typeof getUnpaidInvoicesByStudent>;
  studentName: string;
}

export default function ChargeInvoicesDialog({ unpaidInvoicesPromise, studentName }: ChargeInvoicesDialogProps) {
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [dismissedSurchargeIndices, setDismissedSurchargeIndices] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<Step>('form');
  const detailRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
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
      if (dismissedSurchargeIndices.has(index)) return [];
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
  }, [invoices, unpaidInvoices, dismissedSurchargeIndices]);

  const total = useMemo(() => {
    const totalInvoicesAmount = invoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0) ?? 0;
    const totalAdditionalsAmount = additionals.reduce((acc, additional) => acc + Number(additional.amount), 0) ?? 0;
    const totalSurchargesAmount = surcharges.reduce((acc, s) => acc + s.amount, 0);
    return totalInvoicesAmount + totalAdditionalsAmount + totalSurchargesAmount;
  }, [additionals, invoices, surcharges]);

  // Items shown in the debt detail and in the charge confirmation, each invoice followed by its surcharge
  const detailItems: ReceiptCardItem[] = [
    ...invoices.flatMap((invoice, index) => {
      if (!invoice.selectedId) return [];
      const label = invoicesOptions.find(({ value }) => value === invoice.selectedId)?.label ?? '';
      const surcharge = surcharges.find((s) => s.invoiceIndex === index);
      return [
        { id: `invoice-${invoice.id}`, description: label, amount: Number(invoice.amount) },
        ...(surcharge
          ? [{ id: `surcharge-${invoice.id}`, description: surcharge.receiptDescription, amount: surcharge.amount }]
          : [])
      ];
    }),
    ...additionals
      .filter(({ description }) => description)
      .map((additional) => ({
        id: `additional-${additional.id}`,
        description: additional.description,
        amount: Number(additional.amount)
      }))
  ];

  const todayLabel = new Date().toLocaleDateString('es-AR');
  const paymentMethod = form.watch('paymentMethod');

  function resetDialog() {
    setDismissedSurchargeIndices(new Set());
    setStep('form');
  }

  async function goToConfirm() {
    // Native validation must run while the inputs are visible, they get hidden on the confirm step
    if (!formRef.current?.reportValidity()) return;
    const isValid = await form.trigger();
    if (isValid) setStep('confirm');
  }

  async function copyDetailAsImage() {
    const element = detailRef.current;
    if (!element) return;

    try {
      const blobImage = await domtoimage.toBlob(element);
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobImage })]);
      toast({
        description: 'Detalle copiado como imagen',
        icon: <CheckIcon width='20px' height='20px' />,
        variant: 'success'
      });
    } catch (error) {
      console.error('Something went wrong:', error);
      toast({
        description: 'No se pudo copiar el detalle',
        icon: <ExclamationTriangleIcon width='20px' height='20px' />,
        variant: 'destructive'
      });
    }
  }

  async function copyDetailAsText() {
    const lines = [
      `Detalle de deuda – ${studentName} (${todayLabel})`,
      ...detailItems.map(({ description, amount }) => `• ${description}: ${formatCurrency(amount)}`),
      `Total: ${formatCurrency(total)}`
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({
        description: 'Detalle copiado como texto',
        icon: <CheckIcon width='20px' height='20px' />,
        variant: 'success'
      });
    } catch (error) {
      console.error('Something went wrong:', error);
      toast({
        description: 'No se pudo copiar el detalle',
        icon: <ExclamationTriangleIcon width='20px' height='20px' />,
        variant: 'destructive'
      });
    }
  }

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
      setStep('form');
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

    // Restore surcharge if it was dismissed and a new invoice is selected
    setDismissedSurchargeIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }

  return (
    <Dialog
      open={openInvoiceDialog}
      onOpenChange={(open) => {
        setOpenInvoiceDialog(open);
        if (!open) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm'>Cobrar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'form' && 'Cobrar cuota'}
            {step === 'detail' && 'Detalle de deuda'}
            {step === 'confirm' && 'Confirmar cobro'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' && 'Seleccione el monto a cobrar'}
            {step === 'detail' && 'Copie el detalle para enviarlo. No se registra ningún cobro.'}
            {step === 'confirm' && 'Revise los datos antes de cobrar'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-2 py-3'
            action={action}
            id={CHARGE_INVOICE_FORM_ID}
            ref={formRef}
            onSubmit={(e) => {
              // Only the "Confirmar cobro" button may charge
              if (step !== 'confirm') e.preventDefault();
            }}
          >
            <div className={step === 'form' ? 'space-y-2' : 'hidden'}>
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
                              <Input
                                type='number'
                                placeholder='Importe'
                                autoComplete='off'
                                {...field}
                                value={field.value ?? ''}
                                required
                              />
                              <Button variant='ghost' size='sm' type='button' onClick={() => removeInvoice(index)}>
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
                        <div className='flex justify-between items-center text-sm text-muted-foreground pl-1 pr-1'>
                          <span>{surcharge.displayDescription}:</span>
                          <div className='flex items-center gap-1'>
                            <span>{formatCurrency(surcharge.amount)}</span>
                            <Button
                              variant='ghost'
                              size='sm'
                              type='button'
                              onClick={() =>
                                setDismissedSurchargeIndices((prev) => new Set([...prev, surcharge.invoiceIndex]))
                              }
                            >
                              <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                            </Button>
                          </div>
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
                          <Button variant='ghost' size='sm' type='button' onClick={() => removeAdditional(index)}>
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
                <Button variant='outline' type='button' onClick={() => setOpenInvoiceDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  variant='secondary'
                  type='button'
                  onClick={() => setStep('detail')}
                  disabled={detailItems.length === 0}
                >
                  Ver detalle
                </Button>
                <Button type='button' onClick={goToConfirm}>
                  Cobrar
                </Button>
              </DialogFooter>
            </div>

            {step === 'detail' && (
              <>
                <ReceiptCard
                  ref={detailRef}
                  title='Detalle de deuda'
                  date={todayLabel}
                  studentName={studentName}
                  items={detailItems}
                  total={total}
                  disclaimer='No válido como comprobante de pago'
                />
                <DialogFooter className='pt-2'>
                  <Button variant='outline' type='button' onClick={() => setStep('form')}>
                    Volver
                  </Button>
                  <Button variant='secondary' type='button' onClick={copyDetailAsText}>
                    Copiar texto
                  </Button>
                  <Button type='button' onClick={copyDetailAsImage}>
                    Copiar imagen
                  </Button>
                </DialogFooter>
              </>
            )}

            {step === 'confirm' && (
              <>
                <p>
                  ¿Está seguro que desea cobrar <b className='font-semibold'>{formatCurrency(total)}</b> a{' '}
                  <b className='font-semibold'>{studentName}</b> en{' '}
                  <b className='font-semibold'>{paymentMethodLabels[paymentMethod]}</b>?
                </p>
                <ul className='text-sm text-muted-foreground max-h-40 overflow-y-auto py-1'>
                  {detailItems.map(({ id, description, amount }) => (
                    <li key={id} className='flex justify-between gap-2'>
                      <span>{description}</span>
                      <span>{formatCurrency(amount)}</span>
                    </li>
                  ))}
                </ul>
                <p className='text-sm text-destructive pb-2'>Esta acción registra el pago y genera un comprobante.</p>
                <DialogFooter>
                  <Button variant='outline' type='button' onClick={() => setStep('form')}>
                    Volver
                  </Button>
                  <SubmitButton formId={CHARGE_INVOICE_FORM_ID} title='Confirmar cobro' />
                </DialogFooter>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
