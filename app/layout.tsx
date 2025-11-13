'use client';
import Loading from '@/components/loading';
import { Toaster } from '@/components/ui/sonner';
import { store } from '@/src/lib/jotai';
import { Provider } from 'jotai';
import { Inter } from 'next/font/google';
import 'overlayscrollbars/overlayscrollbars.css';
import { useEffect } from 'react';
import './globals.css';

const interSans = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  function enableAutoSelectAll() {
    document.addEventListener('focusin', (e) => {
      const el = e.target as HTMLElement;

      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        // Hindari reselect jika user sudah pernah fokus manual
        // if (!el.dataset.selected) {
        //   el.select();
        //   el.dataset.selected = 'true';
        // }
        el.select();
      }
    });
  }

  useEffect(() => {
    enableAutoSelectAll();
  }, []);

  return (
    <Provider store={store}>
      <html lang="en" className="light">
        <head>
          <title>NKP Scores</title>
        </head>
        <body className={`${interSans.className} antialiased`}>
          <Toaster richColors position="top-right" theme="light" />
          <Loading />
          <div className="flex h-dvh flex-col overflow-hidden">{children}</div>
        </body>
      </html>
    </Provider>
  );
}
