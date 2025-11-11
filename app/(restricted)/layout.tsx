'use client';
import OverlayScroll from '@/components/overlay-scroll';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import errorHandler from '@/src/lib/error-handler';
import { keywordAtom, setLoading, userAtom } from '@/src/lib/jotai';
import authAPI from '@/src/services/auth';
import { useAtom, useAtomValue } from 'jotai';
import {
  LucideArrowUpWideNarrow,
  LucideChartNoAxesCombined,
  LucideGamepad2,
  LucideHome,
  LucideLogOut,
  LucideSearch,
  LucideUserStar,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const navItems = [
  { icon: LucideHome, label: 'Home', url: '/home', access: ['user'] },
  {
    icon: LucideChartNoAxesCombined,
    label: 'Dashboard',
    url: '/dashboard',
    access: ['guest', 'admin'],
  },
  { icon: LucideUserStar, label: 'Teams', url: '/teams', access: ['user', 'admin'] },
  { icon: LucideGamepad2, label: 'Games', url: '/games', access: ['user', 'admin'] },
  { icon: LucideArrowUpWideNarrow, label: 'History', url: '/history', access: ['admin'] },
  { icon: LucideLogOut, label: 'Logout', url: '/logout', access: ['guest', 'user', 'admin'] },
];

export default function Layout({ children }: { children: ReactNode }) {
  const user = useAtomValue(userAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const pathname = usePathname();
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

  return (
    <div className="flex h-full w-full grow flex-col lg:mx-auto lg:w-3/12 lg:border-x 2xl:w-full">
      <header className="mx-auto w-full bg-linear-to-b from-slate-200 to-transparent px-5 py-2.5">
        <InputGroup className="bg-background mx-auto lg:w-3/12">
          <InputGroupAddon>
            <LucideSearch />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search anything.."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </InputGroup>
      </header>
      <OverlayScroll>
        <div className="relative flex h-full grow flex-col">{children}</div>
      </OverlayScroll>
      <div className="mx-auto flex w-full items-center justify-around border-t lg:w-3/12 lg:border-0">
        {navItems.map((nav, i) => {
          const isActive = pathname.startsWith(nav.url);
          const navClasses = cn(
            'flex flex-col items-center justify-center p-2',
            isActive && 'text-red-500 font-semibold'
          );
          const allowed = nav.access.includes(user?.role ?? '');
          if (allowed)
            return (
              <Link href={nav.url} key={i}>
                <div className={navClasses}>
                  <nav.icon />
                  <small>{nav.label}</small>
                </div>
              </Link>
            );
        })}
      </div>
    </div>
  );
}
