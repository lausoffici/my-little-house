'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams } from '@/hooks/use-search-params';

export default function StudentInvoicesFilters() {
  const { setSearchParams, searchParams } = useSearchParams();

  function onShowAllChange(value: boolean) {
    setSearchParams({ showAll: value.toString(), page: '1' });
  }

  return (
    <div className='flex items-center space-x-2 w-full'>
      <Checkbox
        id='showAll'
        onCheckedChange={onShowAllChange}
        defaultChecked={searchParams.get('showAll') === 'true'}
      />
      <label
        htmlFor='showAll'
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        Mostrar todas
      </label>
    </div>
  );
}
