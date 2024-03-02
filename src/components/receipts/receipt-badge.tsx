'use client';

import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { usePathname, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { useSearchParams } from '@/hooks/use-search-params';
import { padWithZeros } from '@/lib/utils';

type ReceiptDialogTriggerProps = {
  receiptId: number;
};

export function ReceiptBadge({ receiptId }: ReceiptDialogTriggerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setSearchParam } = useSearchParams();

  function handleClick() {
    const isInReceiptsPage = pathname === '/receipts';

    if (isInReceiptsPage) {
      setSearchParam('receiptId', receiptId.toString());
    } else {
      router.push(`/receipts?receiptId=${receiptId}`);
    }
  }

  return (
    <button onClick={handleClick}>
      <Badge className='flex gap-1 items-center w-[min(100px,_100%)]'>
        <span>#{padWithZeros(receiptId)}</span> <ExternalLinkIcon />
      </Badge>
    </button>
  );
}
