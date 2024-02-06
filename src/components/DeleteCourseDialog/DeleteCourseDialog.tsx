import { TrashIcon } from '@radix-ui/react-icons';
import { SetStateAction } from 'react';

import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ICourse } from '@/types';

import { Button } from '../ui/button';

interface DeleteCourseDialogProps {
    course: ICourse;
    setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
}

export default function DeleteCourseDialog({ course, setOpenDialog }: DeleteCourseDialogProps) {
    const { toast } = useToast();

    function handleDelete() {
        toast({
            description: `Curso eliminado: ${course.name}`,
            icon: <TrashIcon width='20px' height='20px' />,
            variant: 'destructive'
        });
        const id = course._id;
        console.log(id);
        setOpenDialog(false);
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
                <Button variant='outline' onClick={() => setOpenDialog(false)}>
                    Cancelar
                </Button>
                <Button variant='destructive' type='button' onClick={handleDelete}>
                    Eliminar
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
