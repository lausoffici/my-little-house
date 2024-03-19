import { parseAbsolute, toCalendarDate } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ErrorWithMessage, ExpiredInvoicesExcelData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(
    amount
  );
}

export function formatDate(date: Date | null) {
  if (!date) return '';
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

export const formatPercentage = (value: number) => {
  return `${value * 100}%`;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

export function convertToCSV(data: ExpiredInvoicesExcelData[], dataHeader: string[]) {
  const header = dataHeader + '\n';
  const body = data.map((item) => Object.values(item).join(',')).join('\n');
  return header + body;
}

export const downloadFile = ({ data, fileName, fileType }: { data: string; fileName: string; fileType: string }) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType });

  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.click();
  a.remove();
};
