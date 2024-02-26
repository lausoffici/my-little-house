import { useSearchParams as useNextSearchParams, usePathname, useRouter } from 'next/navigation';

export const useSearchParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useNextSearchParams();

    const setSearchParam = (key: string, value: string) => {
        const currentURLParams = new URLSearchParams(searchParams);

        const newValue = value.trim();

        if (!newValue) currentURLParams.delete(key);
        else currentURLParams.set(key, newValue);

        const search = currentURLParams.toString();
        const query = search ? `?${search}` : '';

        router.replace(`${pathname}${query}`);
    };

    const setSearchParams = (params: Record<string, string>) => {
        const currentURLParams = new URLSearchParams(searchParams);

        Object.entries(params).forEach(([key, value]) => {
            const newValue = value.trim();

            if (!newValue) currentURLParams.delete(key);
            else currentURLParams.set(key, newValue);
        });

        const search = currentURLParams.toString();
        const query = search ? `?${search}` : '';

        router.replace(`${pathname}${query}`);
    };

    return { pathname, searchParams, setSearchParam, setSearchParams };
};
