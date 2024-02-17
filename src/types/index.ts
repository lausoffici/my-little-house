interface IEntity {
    _id: string;
    creationDate?: Date;
    active?: boolean;
}

export interface ICourse extends IEntity {
    name: string;
    amount: number;
    description: string;
}

export interface IStudent extends IEntity {
    firstName: string;
    lastName: string;
    courses: string[];
    description?: string;
    phones?: { name: string; value: number }[];
    address?: string;
    email?: string;
}

export interface IAvailableCourse {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export type Option = {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableSearchableColumn<TData> {
    id: keyof TData;
    title: string;
}

export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
    options: Option[];
}
