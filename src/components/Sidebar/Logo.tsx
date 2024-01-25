import { Handlee } from 'next/font/google';
import Link from 'next/link';

const handlee = Handlee({ weight: '400', preload: true, subsets: ['latin'] });

export default function Logo() {
    return (
        <Link href='/'>
            <h1 className={`${handlee.className} text-brand-400 font-semibold text-2xl text-center`}>
                My Little House
            </h1>
        </Link>
    );
}
