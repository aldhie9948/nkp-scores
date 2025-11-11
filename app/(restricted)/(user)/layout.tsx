'use client';
import { userAtom } from '@/src/lib/jotai';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { ReactNode, use, useEffect } from 'react';

type Props = {
  children: ReactNode;
};
export default function Layout({ children }: Props) {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'user') router.push('/');
  }, [user]);

  return <div className="flex h-full grow flex-col lg:mx-auto lg:w-3/12">{children}</div>;
}
