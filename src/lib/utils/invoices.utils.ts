import { Invoice } from '@prisma/client';

import { invoiceStateSchema } from '../validations/params';

export const parseInvoiceStatesSearchParam = (statesParam: string | undefined) => {
  return (
    statesParam
      ?.split('.')
      .map((state) => {
        const result = invoiceStateSchema.safeParse(state);
        return result.success ? result.data : undefined;
      })
      .filter(Boolean) ?? []
  );
};

export const getDiscountedAmount = (invoice?: Invoice) => {
  if (!invoice) return 0;
  const { amount, discount } = invoice;
  return amount * (1 - (discount ?? 0));
};
