'use client';
import errorHandler from '@/src/lib/error-handler';
import { setLoading } from '@/src/lib/jotai';
import authAPI from '@/src/services/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    authAPI
      .verify()
      .catch((err) => {
        errorHandler(err);
        router.push('/');
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, []);

  return <>{children}</>;
}
