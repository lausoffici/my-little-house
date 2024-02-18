'use client';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type SortingState,
    type VisibilityState,
    functionalUpdate,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

interface UseDataTableProps<TData> {
    data: any[];
    columns: ColumnDef<TData>[];
    pageCount: number;
    searchableColumns?: string[];
    filterableColumns?: string[];
}

export function useURLManagedDataTable<TData>({
    data,
    columns,
    pageCount,
    searchableColumns = [],
    filterableColumns = []
}: UseDataTableProps<TData>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Search params
    const pageNumber = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams?.get('size')) || 10;
    const sortBy = searchParams.get('sortBy') ?? 'lastName';
    const sortOrder = searchParams.get('sortOrder') ?? 'asc';

    // Table states
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const updateQueryString = React.useCallback(
        (newParams: Record<string, string | number | null>) => {
            const currentParams = new URLSearchParams(searchParams.toString());
            Object.entries(newParams).forEach(([key, value]) =>
                value === null ? currentParams.delete(key) : currentParams.set(key, String(value))
            );
            router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const pagination = React.useMemo<PaginationState>(() => {
        return {
            pageIndex: pageNumber - 1,
            pageSize: pageSize
        };
    }, [pageNumber, pageSize]);

    const sorting = React.useMemo<SortingState>(() => {
        return [
            {
                id: sortBy,
                desc: sortOrder === 'desc'
            }
        ];
    }, [sortBy, sortOrder]);

    const columnFilters = React.useMemo<ColumnFiltersState>(() => {
        const allValidColumns = [...searchableColumns, ...filterableColumns].map(
            (columnName) => columnName
        ) as string[];
        return Array.from(searchParams.entries())
            .filter(([key]) => allValidColumns.includes(key))
            .map(([key, value]) => ({
                id: key,
                value: filterableColumns.some((columnName) => columnName === key) ? value.split('.') : value
            }));
    }, [filterableColumns, searchParams, searchableColumns]);

    const setPagination = ({ pageIndex, pageSize }: PaginationState) => {
        updateQueryString({
            page: pageIndex + 1,
            size: pageSize
        });
    };

    const setSorting = (sorting: SortingState) => {
        const [sort] = sorting;
        updateQueryString({
            sortBy: sort.id,
            sortOrder: sort.desc ? 'desc' : 'asc'
        });
    };

    const setColumnFilters = (filters: ColumnFiltersState) => {
        const newParamsObject: Record<string, string | number | null> = filters.reduce(
            (acc, filter) => {
                const isSearchable = searchableColumns.some((columnName) => columnName === filter.id);
                const isFilterable = filterableColumns.some((columnName) => columnName === filter.id);

                if (isSearchable || isFilterable) {
                    const value = Array.isArray(filter.value) ? filter.value.join('.') : filter.value;
                    return { ...acc, [filter.id]: value };
                }
                return acc;
            },
            { page: 1 } // reset the page to 1 when filters change
        );

        // Remove any filter parameters that are not in the current filters.
        Array.from(searchParams.keys()).forEach((key) => {
            if (!newParamsObject.hasOwnProperty(key)) {
                newParamsObject[key] = null;
            }
        });

        updateQueryString(newParamsObject);
    };

    const dataTable = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        state: {
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: (updaterFunction) => {
            const newValue = functionalUpdate(updaterFunction, pagination);
            setPagination(newValue);
        },
        onSortingChange: (updaterFunction) => {
            const newValue = functionalUpdate(updaterFunction, sorting);
            setSorting(newValue);
        },
        onColumnFiltersChange: (updaterFunction) => {
            const newValue = functionalUpdate(updaterFunction, columnFilters);
            setColumnFilters(newValue);
        },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true
    });

    return dataTable;
}
