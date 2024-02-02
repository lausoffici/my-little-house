import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const options = [
    {
        title: 'Editar',
        icon: <Pencil2Icon />
    },
    {
        title: 'Eliminar',
        icon: <TrashIcon />
    }
];

export default function CourseCardMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='p-2 absolute top-[7px] right-[7px]' title='Opciones'>
                    <DotsVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map(({ title, icon }) => (
                    <DropdownMenuItem key={title}>
                        {title}
                        <DropdownMenuShortcut>{icon}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
