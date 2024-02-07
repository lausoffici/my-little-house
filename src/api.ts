import { ICourse, IStudent } from './types';

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

const students: IStudent[] = [
    {
        firstName: 'Julieta',
        lastName: 'Pontino',
        courses: ['Advanced'],
        _id: '138'
    },
    {
        firstName: 'Lionel',
        lastName: 'Messi',
        courses: ['Initial'],
        _id: '137'
    },
    {
        firstName: 'Lautaro',
        lastName: 'Soffici',
        courses: ['Advanced'],
        _id: '136'
    },
    {
        firstName: 'Romeo',
        lastName: 'Santos',
        courses: ['Children'],
        _id: '135'
    },
    {
        firstName: 'Taylor',
        lastName: 'Swift',
        courses: ['Proficency'],
        _id: '134'
    },
    {
        firstName: 'Ed',
        lastName: 'Sheeran',
        courses: ['Intermediate'],
        _id: '133'
    },
    {
        firstName: 'Mwezi',
        lastName: 'Pontino',
        courses: ['Children'],
        _id: '132'
    },
    {
        firstName: 'Mimi',
        lastName: 'Soffici',
        courses: ['Children'],
        _id: '131'
    },
    {
        firstName: 'Franki',
        lastName: 'Pontino Soffici',
        courses: ['Conversational'],
        _id: '130'
    },
    {
        firstName: 'Indio',
        lastName: 'Solari',
        courses: ['FCE'],
        _id: '100'
    },
    {
        firstName: 'Pollo',
        lastName: 'Vignolo',
        courses: ['Initial'],
        _id: '101'
    },
    {
        firstName: 'Neymar',
        lastName: 'Junior',
        courses: ['Advanced'],
        _id: '102'
    },
    {
        firstName: 'Wanda',
        lastName: 'Nara',
        courses: ['Intermediate'],
        _id: '103'
    },
    {
        firstName: 'Clara',
        lastName: 'Bow',
        courses: ['Advanced'],
        _id: '104'
    },
    {
        firstName: 'Hilary',
        lastName: 'Clinton',
        courses: ['Advanced'],
        _id: '105'
    },
    {
        firstName: 'Rory',
        lastName: 'Gilmore',
        courses: ['FCE'],
        _id: '106'
    },
    {
        firstName: 'Lorelai',
        lastName: 'Gilmore',
        courses: ['Initial'],
        _id: '107'
    },
    {
        firstName: 'Jason',
        lastName: 'Wayland',
        courses: ['FCE'],
        _id: '108'
    },
    {
        firstName: 'Diego',
        lastName: 'Maradona',
        courses: ['Intermediate'],
        _id: '109'
    },
    {
        firstName: 'Moria',
        lastName: 'Casan',
        courses: ['FCE'],
        _id: '110'
    },
    {
        firstName: 'Brula',
        lastName: 'Artaza',
        courses: ['Advanced'],
        _id: '111'
    },
    {
        firstName: 'Julio',
        lastName: 'Alvarez',
        courses: ['Advanced'],
        _id: '112'
    },
    {
        firstName: 'Tonga',
        lastName: 'Galvan',
        courses: ['Intermediate'],
        _id: '113'
    },
    {
        firstName: 'Kiex',
        lastName: 'Corio',
        courses: ['Conversational'],
        _id: '114'
    },
    {
        firstName: 'Salsa',
        lastName: 'Saller',
        courses: ['FCE'],
        _id: '115'
    },
    {
        firstName: 'BH',
        lastName: 'Hornos',
        courses: ['Children'],
        _id: '116'
    },
    {
        firstName: 'Molejandro',
        lastName: 'Mole',
        courses: ['Initial'],
        _id: '117'
    },
    {
        firstName: 'Nico',
        lastName: 'Occiato',
        courses: ['Intermediate'],
        _id: '118'
    },
    {
        firstName: 'Nati',
        lastName: 'Jota',
        courses: ['FCE'],
        _id: '119'
    },
    {
        firstName: 'Rodrigo',
        lastName: 'Bueno',
        courses: ['Conversational'],
        _id: '120'
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
    },
    getStudents: async (): Promise<IStudent[]> => {
        await sleep(750);
        return students;
    },
    getStudent: async (id: IStudent['_id']): Promise<IStudent> => {
        await sleep(750);
        const student = students.find((student) => student['_id'] === id);

        if (!student) throw new Error('Course not found');

        return student;
    }
};

export default api;
