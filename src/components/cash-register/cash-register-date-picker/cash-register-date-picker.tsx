'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DateValue } from 'react-aria';

import { DateTimePicker } from '@/components/ui/date-picker/date-picker';
import { getDatePickerFormattedDate } from '@/lib/utils';

export default function CashRegisterDatePicker() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const day = Number(searchParams.get('day')) || new Date().getDate();
    const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = Number(searchParams.get('year')) || new Date().getFullYear();

    const defaultDate = getDatePickerFormattedDate(new Date(year, month - 1, day));

    function handleChange(value: DateValue) {
        const currentParams = new URLSearchParams(searchParams.toString());

        currentParams.set('day', value.day.toString());
        currentParams.set('month', value.month.toString());
        currentParams.set('year', value.year.toString());

        router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }

    return <DateTimePicker aria-label='Fecha de caja' defaultValue={defaultDate} onChange={handleChange} />;
}
