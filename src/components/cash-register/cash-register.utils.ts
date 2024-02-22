import { ReadonlyURLSearchParams } from 'next/navigation';

import { SearchParams } from '@/types';

// Given a year, month and day, it returns true if it's a valid date
export const isValidDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
};

// Returns a Date object based on the search params day/month/year
export const getAppliedDateFromSearchParams = (searchParams: ReadonlyURLSearchParams) => {
    const day = Number(searchParams.get('day'));
    const month = Number(searchParams.get('month'));
    const year = Number(searchParams.get('year'));

    if (!day || !month || !year || !isValidDate(year, month, day)) {
        return new Date();
    }

    return new Date(year, month - 1, day);
};

// Returns an object with the year, month and day based on the search params day/month/year
export const getYearMonthDayFromSearchParams = (searchParams: SearchParams) => {
    const dayNumber = Number(searchParams.day);
    const monthNumber = Number(searchParams.month);
    const yearNumber = Number(searchParams.year);

    if (dayNumber || monthNumber || yearNumber || !isValidDate(yearNumber, monthNumber, dayNumber)) {
        const today = new Date();
        return {
            yearNumber: today.getFullYear(),
            monthNumber: today.getMonth() + 1,
            dayNumber: today.getDate()
        };
    }

    return { yearNumber, monthNumber, dayNumber };
};
