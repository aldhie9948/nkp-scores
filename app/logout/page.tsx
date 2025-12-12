'use client';
import Loading from '@/components/loading';
import errorHandler from '@/src/lib/error-handler';
import { setLoading } from '@/src/lib/jotai';
import authAPI from '@/src/services/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  const logoutHandler = useCallback(() => {
    try {
      setLoading(true);
      authAPI.logout();
      router.push('/');
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false, 1000);
    }
  }, []);

  useEffect(() => {
    logoutHandler();
  }, []);
  return <Loading />;
}
