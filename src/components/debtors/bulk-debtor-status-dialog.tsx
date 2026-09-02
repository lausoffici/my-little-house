'use client';

import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Table as TanStackTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { markStudentsAsDebtor, unmarkStudentsAsDebtor } from '@/lib/debtors';

type DebtorRow = { studentId: number; student: { firstName: string; lastName: string } };

interface BulkDebtorStatusDialogProps<TData extends DebtorRow> {
  table: TanStackTable<TData>;
  mode: 'mark' | 'unmark';
}

export default function BulkDebtorStatusDialog<TData extends DebtorRow>({
  table,
  mode
}: BulkDebtorStatusDialogProps<TData>) {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isMark = mode === 'mark';
  const actionLabel = isMark ? 'Marcar como Deudor' : 'Quitar de Deudores';

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const uniqueStudents = useMemo(() => {
    const studentsById = new Map<number, string>();
    selectedRows.forEach((row) => {
      const { studentId, student } = row.original;
      if (!studentsById.has(studentId)) studentsById.set(studentId, `${student.firstName} ${student.lastName}`);
    });
    return Array.from(studentsById, ([id, fullName]) => ({ id, fullName }));
  }, [selectedRows]);

  async function handleConfirm() {
    try {
      const studentIds = uniqueStudents.map(({ id }) => id);
      if (isMark) await markStudentsAsDebtor(studentIds);
      else await unmarkStudentsAsDebtor(studentIds);

      toast({
        description: isMark
          ? `${uniqueStudents.length} estudiante(s) marcado(s) como deudor`
          : `${uniqueStudents.length} estudiante(s) quitado(s) de deudores`,
        icon: <CheckIcon width='20px' height='20px' />,
        variant: 'success'
      });

      setOpenDialog(false);
      table.resetRowSelection();
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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={uniqueStudents.length === 0}>
          {actionLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar {actionLabel}</DialogTitle>
        </DialogHeader>
        <div className='my-3'>
          {isMark ? (
            <>
              ¿Desea marcar a los siguientes <b className='font-semibold'>{uniqueStudents.length}</b> estudiante(s) como
              deudores? Sus cuotas impagas dejarán de aparecer en Vencimientos y se listarán en Deudores hasta que se
              les cobre alguna cuota.
            </>
          ) : (
            <>
              ¿Desea quitar a los siguientes <b className='font-semibold'>{uniqueStudents.length}</b> estudiante(s) de
              la lista de deudores? Sus cuotas vencidas impagas volverán a aparecer en Vencimientos.
            </>
          )}
          <ul className='list-disc list-inside mt-2 max-h-40 overflow-y-auto'>
            {uniqueStudents.map(({ id, fullName }) => (
              <li key={id}>{fullName}</li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button type='button' onClick={handleConfirm}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
