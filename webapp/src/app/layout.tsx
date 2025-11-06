import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { AppLayout } from '@/components/layout/app-layout';
import { Footer } from '@/components/layout/footer';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'QASA Platform',
    template: '%s | QASA Platform',
  },
  description:
    'Plataforma de Auditorías de Calidad y Seguridad para la gestión integral de instalaciones',
  keywords: ['auditoría', 'seguridad', 'calidad', 'gestión de instalaciones'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AppLayout>{children}</AppLayout>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
