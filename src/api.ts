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
    },
    {
        _id: '06',
        creationDate: new Date(),
        active: true,
        name: 'Teens',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '07',
        creationDate: new Date(),
        active: true,
        name: 'Proficiency',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '08',
        creationDate: new Date(),
        active: true,
        name: 'First Certificate',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '09',
        creationDate: new Date(),
        active: true,
        name: 'Advanced',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },
    {
        _id: '10',
        creationDate: new Date(),
        active: true,
        name: 'Proficiency',
        description: `Lunes y Miércoles 15hs
        Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '11',
        creationDate: new Date(),
        active: true,
        name: 'First Certificate',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '12',
        creationDate: new Date(),
        active: true,
        name: 'Advanced',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '13',
        creationDate: new Date(),
        active: true,
        name: 'Proficiency',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '14',
        creationDate: new Date(),
        active: true,
        name: 'First Certificate',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '15',
        creationDate: new Date(),
        active: true,
        name: 'Advanced',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '16',
        creationDate: new Date(),
        active: true,
        name: 'Proficiency',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '17',
        creationDate: new Date(),
        active: true,
        name: 'First Certificate',
        description: `Lunes y Miércoles 15hs
            Martes y Jueves 16hs`,
        amount: 12000
    },

    {
        _id: '18',
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
