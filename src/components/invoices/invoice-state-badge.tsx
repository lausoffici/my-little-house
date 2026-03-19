import { Invoice } from '@prisma/client';

import { Badge } from '@/components/ui/badge';
import { InvoicesStatusType } from '@/types';

const invoicesStatus: InvoicesStatusType = {
  P: {
    text: 'Pagado',
    color: 'success'
  },
  B: {
    text: 'Becado',
    color: 'informative'
  },
  I: {
    text: 'Impago',
    color: 'destructive'
  }
};

type InvoiceStateBadgeProps = {
  state: Invoice['state'];
  receiptId?: number;
};

export default function InvoiceStateBadge({ state, receiptId }: InvoiceStateBadgeProps) {
  const { color, text } = invoicesStatus[state];

  if (state === 'P' && receiptId) {
    return (
      <a href={`/receipts?receiptId=${receiptId}`} target='_blank' rel='noopener noreferrer'>
        <Badge variant={color} className='font-semibold underline cursor-pointer'>
          {text}
        </Badge>
      </a>
    );
  }

  return (
    <Badge variant={color} className='font-semibold'>
      {text}
    </Badge>
  );
}
