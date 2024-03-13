'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from './ui/button';

type SubmitButtonProps = {
  formId: string;
  title: string;
};

export function SubmitButton({ formId, title }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' form={formId} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className='animate-spin' height={16} /> Cargando...
        </>
      ) : (
        title
      )}
    </Button>
  );
}
