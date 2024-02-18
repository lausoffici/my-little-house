export type Option = {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
};

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}
