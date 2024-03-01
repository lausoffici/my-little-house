'use client';

import { ResetIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='w-full h-full'>
      <div className='flex flex-col gap-3 w-1/4'>
        <h2 className='font-semibold text-2xl'>Página no encontrada </h2>
        <Link href='/students' className='flex gap-2 items-center hover:bg-muted/50 w-fit p-2 px-3 rounded-md'>
          Volver al home <ResetIcon width={15} />
        </Link>
      </div>
    </div>
  );
}
