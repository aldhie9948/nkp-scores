'use client';
import { userAtom } from '@/src/lib/jotai';
import { allowedAccess } from '@/src/lib/utils';
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
    allowedAccess(['user', 'admin'], () => router.push('/'));
  }, [user]);

  return <div className="flex h-full grow flex-col lg:mx-auto lg:w-3/12">{children}</div>;
}
