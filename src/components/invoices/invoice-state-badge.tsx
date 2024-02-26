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

export default function InvoiceStateBadge({ state }: { state: Invoice['state'] }) {
    return <Badge variant={invoicesStatus[state].color}>{invoicesStatus[state].text}</Badge>;
}
