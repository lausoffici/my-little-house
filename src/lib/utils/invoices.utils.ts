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

export const getDiscountedAmount = (amount: number = 0, discount: number = 0) => {
  return amount * (1 - (discount ?? 0));
};
