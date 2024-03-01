'use client';

import { useSearchParams } from '@/hooks/use-search-params';

import ReceiptBadge from './receipt-badge';

export function ReceiptDialogTrigger({ receiptId }: { receiptId: number }) {
  const { setSearchParam } = useSearchParams();

  function handleOpen() {
    setSearchParam('receiptId', receiptId.toString());
  }

  return (
    <button onClick={handleOpen}>
      <ReceiptBadge receiptId={receiptId} />
    </button>
  );
}
