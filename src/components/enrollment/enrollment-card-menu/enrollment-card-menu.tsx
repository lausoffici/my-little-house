'use client';

import { Enrollment } from '@prisma/client';
import { DotsVerticalIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import EditEnrollmentDialog from '@/components/enrollment/edit-enrollment-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function EnrollmentCardMenu({ enrollment }: { enrollment: Enrollment }) {
  const [openEditDialog, setOpenEditDialog] = useState(false);

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
          <EditEnrollmentDialog enrollment={enrollment} onOpenChange={setOpenEditDialog} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
