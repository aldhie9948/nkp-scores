'use client';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import 'overlayscrollbars/overlayscrollbars.css';
import './globals.css';
import { Provider } from 'jotai';
import { store } from '@/src/lib/jotai';
import { useEffect } from 'react';
import Loading from '@/components/loading';
import { ThemeProvider } from '@/components/theme-provider';

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
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>NKP Scores</title>
        </head>
        <body className={`${interSans.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            <Toaster richColors position="top-right" theme="light" />
            <Loading />
            <div className="flex h-dvh flex-col overflow-hidden">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  );
}
