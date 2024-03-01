import { ExternalLinkIcon } from '@radix-ui/react-icons';

import { Badge } from '@/components/ui/badge';
import { padWithZeros } from '@/lib/utils';

export default function ReceiptBadge({ receiptId }: { receiptId: number }) {
    return (
        <Badge className='flex gap-1 items-center w-[min(100px,_100%)]'>
            <span>#{padWithZeros(receiptId)}</span> <ExternalLinkIcon />
        </Badge>
    );
}
