'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSearchParams } from '@/hooks/use-search-params';

export default function DebtorsTableFilters() {
  const { searchParams, setSearchParams } = useSearchParams();

  function handleSwitchChange(checked: boolean) {
    setSearchParams({ withInactiveStudents: checked ? 'true' : '', page: '1' });
  }

  return (
    <div className='flex items-center space-x-2'>
      <Switch
        id='debtors-state'
        checked={searchParams.get('withInactiveStudents') === 'true'}
        onCheckedChange={handleSwitchChange}
      />
      <Label htmlFor='debtors-state'>Incluir Inactivos</Label>
    </div>
  );
}
