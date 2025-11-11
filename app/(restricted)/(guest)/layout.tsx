'use client';
import { userAtom } from '@/src/lib/jotai';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};
export default function Layout({ children }: Props) {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (user && ['user'].includes(user.role)) router.push('/');
  }, [user]);

  return children;
}
