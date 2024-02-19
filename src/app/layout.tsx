import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';

import Sidebar from '@/components/common/sidebar/sidebar';
import TopNavigationBar from '@/components/common/top-navigation-bar/top-navigation-bar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { authOptions } from '@/lib/auth';

import Favicon from '../../public/assets/metadata/favicon.ico';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'My Little House',
    description: 'Website developed for an English teaching establishment',
    icons: [{ rel: 'icon', url: Favicon.src }]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang='en'>
            <body className={`${inter.className} flex`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    <div className='flex h-screen w-full'>
                        <Sidebar />
                        <div className='flex-1 flex flex-col overflow-hidden'>
                            <TopNavigationBar user={session?.user} />
                            <main className='p-6 overflow-auto'>{children}</main>
                        </div>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
