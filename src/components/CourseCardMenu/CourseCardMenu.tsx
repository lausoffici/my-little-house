'use client';

import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ICourse } from '@/types';

import EditCourseDialog from '../EditCourseDialog';

export default function CourseCardMenu({ course }: { course: ICourse }) {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='p-2 absolute top-[7px] right-[7px]' title='Opciones'>
                    <DotsVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger className='w-full'>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Editar
                            <DropdownMenuShortcut>
                                <Pencil2Icon />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <EditCourseDialog course={course} setOpenDialog={setOpenDialog} />
                </Dialog>

                <DropdownMenuItem>
                    Eliminar
                    <DropdownMenuShortcut>
                        <TrashIcon />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
