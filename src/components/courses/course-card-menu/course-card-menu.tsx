'use client';

import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import DeleteCourseDialog from '@/components/courses/delete-course-dialog';
import EditCourseDialog from '@/components/courses/edit-course-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ICourse } from '@/types';

export default function CourseCardMenu({ course }: { course: ICourse }) {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='p-2 absolute top-[7px] right-[7px]' title='Opciones'>
                    <DotsVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                    <DialogTrigger className='w-full'>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Editar
                            <DropdownMenuShortcut>
                                <Pencil2Icon />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <EditCourseDialog course={course} onOpenChange={setOpenEditDialog} />
                </Dialog>

                <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                    <DialogTrigger className='w-full'>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Eliminar
                            <DropdownMenuShortcut>
                                <TrashIcon />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DeleteCourseDialog course={course} onOpenChange={setOpenDeleteDialog} />
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
