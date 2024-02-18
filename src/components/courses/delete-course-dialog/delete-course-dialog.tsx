import { Course } from '@prisma/client';
import { TrashIcon } from '@radix-ui/react-icons';
import { SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface DeleteCourseDialogProps {
    course: Course;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}

export default function DeleteCourseDialog({ course, onOpenChange }: DeleteCourseDialogProps) {
    const { toast } = useToast();

    function handleDelete() {
        toast({
            description: `Curso eliminado: ${course.name}`,
            icon: <TrashIcon width='20px' height='20px' />,
            variant: 'destructive'
        });
        const id = course.id;
        console.log(id);
        onOpenChange(false);
    }
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <div className='my-3'>
                ¿Desea eliminar <span className='font-semibold'>{course.name}</span> definitivamente?
            </div>
            <DialogFooter>
                <Button variant='outline' onClick={() => onOpenChange(false)}>
                    Cancelar
                </Button>
                <Button variant='destructive' type='button' onClick={handleDelete}>
                    Eliminar
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
