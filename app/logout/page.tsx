'use client';
import Loading from '@/components/loading';
import { setLoading } from '@/src/lib/jotai';
import authAPI from '@/src/services/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    authAPI.logout();
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1000);
  }, []);
  return <Loading />;
}
