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

export function formatDate(date: Date) {
  return date.toISOString().replace(/T.*/, '').split('-').reverse().join('/');
}

export function formatTime(date: Date) {
  const locales = 'default';
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  } as const;

  return new Date(date).toLocaleTimeString(locales, options);
}

export function getDatePickerFormattedDate(date: Date) {
  return toCalendarDate(parseAbsolute(date.toISOString(), 'UTC'));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  if (date.getMonth() <= 0) return '';

  return capitalizeFirstLetter(date.toLocaleString('es', { month: 'long' }));
}

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export function padWithZeros(number: number) {
  let strNumber = String(number);
  return strNumber.padStart(7, '0');
}

export function getPaginationClause(page: number, size: number) {
  return {
    skip: (page - 1) * size,
    take: size
  };
}

export const getTodaysData = () => {
  const date = new Date();

  return {
    currentMonth: date.getMonth() + 1,
    currentYear: date.getFullYear()
  };
};
