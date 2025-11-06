'use client';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import 'overlayscrollbars/overlayscrollbars.css';
import './globals.css';
import { Provider } from 'jotai';
import { store } from '@/src/lib/jotai';

const interSans = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en" className="light">
        <head>
          <title>NKP Scores</title>
        </head>
        <body className={`${interSans.className} antialiased`}>
          <Toaster richColors position="bottom-right" />
          <div className="flex h-dvh flex-col overflow-hidden">{children}</div>
        </body>
      </html>
    </Provider>
  );
}
