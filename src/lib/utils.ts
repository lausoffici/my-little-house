import { parseAbsolute, toCalendarDate } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(
        amount
    );
}

export function formateDate(date: Date) {
    return date.toISOString().replace(/T.*/, '').split('-').reverse().join('/');
}

export function getDatePickerFormattedDate(date: Date) {
    return toCalendarDate(parseAbsolute(date.toISOString(), 'UTC'));
}
