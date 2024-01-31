import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { TrashIcon } from '@radix-ui/react-icons';

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
                        <DropdownMenuShortcut className='text-brand-black-100 '>{icon}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
