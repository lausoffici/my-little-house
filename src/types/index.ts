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
