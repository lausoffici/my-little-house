'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { Vesper_Libre } from 'next/font/google';
import Image from 'next/image';
import React, { useRef } from 'react';
import { useState } from 'react';
import ReactToPrint from 'react-to-print';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency, formateDate, padWithZeros } from '@/lib/utils';
import { ReceiptsWithItemsAndStudents } from '@/types';

import Logo from '../common/sidebar/logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '../ui/card';

type ReceiptsDialogProps = {
    receipt: ReceiptsWithItemsAndStudents;
};

const vesper = Vesper_Libre({
    subsets: ['latin'],
    weight: '400'
});

export default function ReceiptsDialog({ receipt }: ReceiptsDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const receiptRef = useRef(null);

    const fullName = `${receipt.student.firstName} ${receipt.student.lastName}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size='sm' className='py-0 px-2'>
                    <span className='mr-2'>#{padWithZeros(receipt.id)}</span>
                    <ExternalLinkIcon width={15} height={15} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Comprobante</DialogTitle>
                </DialogHeader>
                <Card ref={receiptRef} className='print:block print:m-2 print:scale-90'>
                    <CardHeader className='py-1'>
                        <div className='flex justify-between px-7'>
                            <Image src='/assets/old-logo.png' alt='casa' width={100} height={80} />
                            <div className='flex flex-col justify-center items-center'>
                                <Logo />
                                <h1>INGLÉS</h1>
                            </div>
                        </div>
                        <div className='border-b-2 border-gray-200 w-full'></div>
                        <CardDescription className='flex flex-col items-end'>
                            <div className='w-full flex justify-between items-center mt-1'>
                                <span>(Documento no válido como factura)</span>
                                <span>#{padWithZeros(receipt.id)}</span>
                            </div>
                        </CardDescription>
                        <span className='text-sm'>{formateDate(receipt.createdAt)}</span>
                    </CardHeader>
                    <CardContent>
                        <div className='my-4'>
                            <span className=' mr-2'>Estudiante:</span>
                            <span className='font-semibold'>{fullName}</span>
                        </div>

                        <div className='flex justify-between py-2'>
                            <span className='font-semibold'>Concepto</span>
                            <span className='font-semibold'>Importe</span>
                        </div>
                        <div className='border-b-2 border-gray-600 w-full'></div>
                        <div className='flex flex-col gap-2 py-2'>
                            {receipt.items.map((item) => (
                                <div key={item.id} className='flex justify-between'>
                                    <span className='italic'>{item.description}</span>
                                    <span>{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>

                        <div className='border-b-2 border-gray-600 w-full'></div>
                        <div className='flex justify-between py-2'>
                            <span className='font-bold'>TOTAL</span>
                            <span className='font-semibold'>{formatCurrency(receipt.total)}</span>
                        </div>
                    </CardContent>
                    <CardFooter className='pt-7 flex justify-center items-center'>
                        <div className={`border border-gray-500 py-1 px-3 ${vesper.className}`}>
                            Enseñanza de calidad con calidez desde 1987
                        </div>
                    </CardFooter>
                </Card>
                <DialogFooter className='flex flex-row justify-between w-full '>
                    <Button variant='outline' onClick={() => setIsOpen(false)}>
                        Cerrar
                    </Button>
                    <ReactToPrint
                        trigger={() => <Button onClick={handlePrint}>Guardar/Imprimir</Button>}
                        content={() => receiptRef.current}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
