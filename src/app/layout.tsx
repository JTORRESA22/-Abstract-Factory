import { Providers } from './providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'App de Pagos',
    description: 'Aplicación para calcular pagos',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body className={`${inter.className} bg-gray-100 dark:bg-gray-900`}>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}