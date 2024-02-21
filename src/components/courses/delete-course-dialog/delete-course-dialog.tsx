import { Course } from '@prisma/client';
import { ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteCourse } from '@/lib/courses';

interface DeleteCourseDialogProps {
    course: Course;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}

export default function DeleteCourseDialog({ course, onOpenChange }: DeleteCourseDialogProps) {
    const { toast } = useToast();
    const { name, id } = course;
    const router = useRouter();

    async function handleDelete() {
        try {
            await deleteCourse(id);

            toast({
                description: `Curso eliminado: ${name}`,
                icon: <TrashIcon width='20px' height='20px' />,
                variant: 'destructive'
            });

            onOpenChange(false);
            router.refresh();
        } catch (err) {
            toast({
                description: `Ha ocurrido un error`,
                icon: <ExclamationTriangleIcon width='20px' height='20px' />,
                variant: 'destructive'
            });
            console.error(err);
        }
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
