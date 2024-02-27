'use client';

import { ExternalLinkIcon } from '@radix-ui/react-icons';

import { useSearchParams } from '@/hooks/use-search-params';
import { padWithZeros } from '@/lib/utils';

import { Button } from '../ui/button';

export function ReceiptDialogTrigger({ receiptId }: { receiptId: number }) {
    const { setSearchParam } = useSearchParams();

    function handleOpen() {
        setSearchParam('receiptId', receiptId.toString());
    }

    return (
        <Button size='sm' className='py-0 px-2' onClick={handleOpen}>
            <span className='mr-2'>#{padWithZeros(receiptId)}</span>
            <ExternalLinkIcon width={15} height={15} />
        </Button>
    );
}
