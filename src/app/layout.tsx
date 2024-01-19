import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Favicon from "../../public/images/metadata/favicon.ico"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Little House',
  description: 'Website developed for an English teaching establishment',
  icons: [{ rel: 'icon', url: Favicon.src }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
