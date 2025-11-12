'use client';
import { userAtom } from '@/src/lib/jotai';
import { allowedAccess } from '@/src/lib/utils';
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
    allowedAccess(['admin'], () => router.push('/'));
  }, [user]);

  return children;
}
