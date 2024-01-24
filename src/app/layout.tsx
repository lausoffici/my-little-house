import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Favicon from "../../public/assets/metadata/favicon.ico";
import Sidebar from "./ui/Sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Little House",
  description: "Website developed for an English teaching establishment",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex gap-1`}>
        <Sidebar />
        <main className="bg-brand-50 w-full rounded-3xl m-1">{children}</main>
      </body>
    </html>
  );
}
