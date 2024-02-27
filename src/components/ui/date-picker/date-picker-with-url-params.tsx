'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DateValue } from 'react-aria';

import { DateTimePicker } from '@/components/ui/date-picker/date-picker';
import { getDatePickerFormattedDate } from '@/lib/utils';
import { getAppliedDateFromSearchParams } from '@/lib/utils/cash-register.utils';

export default function DatePickerWithURLParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const appliedDate = getAppliedDateFromSearchParams(searchParams);
    const defaultValue = getDatePickerFormattedDate(appliedDate);

    function handleChange(value: DateValue) {
        const currentParams = new URLSearchParams(searchParams.toString());

        currentParams.set('day', value.day.toString());
        currentParams.set('month', value.month.toString());
        currentParams.set('year', value.year.toString());

        router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }

    return (
        <div className='font-medium'>
            <label className='text-sm'>Fecha</label>
            <DateTimePicker aria-label='Fecha' defaultValue={defaultValue} onChange={handleChange} />
        </div>
    );
}
