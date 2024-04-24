import { Handlee } from 'next/font/google';
import Link from 'next/link';

const handlee = Handlee({ weight: '400', preload: true, subsets: ['latin'] });

export default function Logo() {
  return (
    <Link href='/'>
      <h1 className={`${handlee.className} text-foreground font-semibold text-2xl text-center`}>My Institute&apos;s Name</h1>
    </Link>
  );
}
