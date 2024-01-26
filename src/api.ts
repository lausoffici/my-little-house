import { ICourse } from './types';

const courses: ICourse[] = [
    {
        _id: '01',
        creationDate: new Date(),
        active: true,
        name: 'Pre Intermediate',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs `,
        amount: 12000
    },
    {
        _id: '02',
        creationDate: new Date(),
        active: true,
        name: 'Adults',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '03',
        creationDate: new Date(),
        active: true,
        name: 'Pre Teens',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '04',
        creationDate: new Date(),
        active: true,
        name: 'Initial',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '05',
        creationDate: new Date(),
        active: true,
        name: 'Advanced',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    }
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
    getCourses: async (): Promise<ICourse[]> => {
        await sleep(750);
        return courses;
    },
    getCourse: async (id: ICourse['_id']): Promise<ICourse> => {
        await sleep(750);
        const course = courses.find((course) => course['_id'] === id);

        if (!course) throw new Error('Course not found');

        return course;
    }
};

export default api;
