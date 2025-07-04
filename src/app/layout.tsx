import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppLogo } from '@/components/icons/app-logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Added for Study link

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '7K Life',
  description: 'Your personal dashboard for growth and productivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <header className="p-4 border-b border-border">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <AppLogo />
              <h1 className="text-2xl font-bold text-primary">7K Life</h1>
            </Link>
            <nav>
              <Link href="/study" passHref>
                <Button variant="ghost">Study Mode</Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
