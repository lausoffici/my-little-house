'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currentYear } from '@/lib/constants';

export default function YearSelect({ years }: { years: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  function handleOnValueChange(value: string) {
    setSelectedYear(value);
    currentParams.set('balance_year', value);
    router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
  }

  return (
    <Select value={selectedYear} onValueChange={handleOnValueChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem value={year} key={year} className='font-normal'>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
