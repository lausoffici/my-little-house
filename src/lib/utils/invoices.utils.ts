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

export const getDiscountedAmount = ({ amount, discount }: { amount: number; discount: number }) => {
  return amount * (1 - (discount ?? 0));
};
