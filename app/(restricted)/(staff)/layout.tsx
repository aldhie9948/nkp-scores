'use client';
import OverlayScroll from '@/components/overlay-scroll';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { keywordAtom, userAtom } from '@/src/lib/jotai';
import { useAtom, useAtomValue } from 'jotai';
import {
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
  { icon: LucideHome, label: 'Home', url: '/home' },
  { icon: LucideUserStar, label: 'Teams', url: '/teams' },
  { icon: LucideGamepad2, label: 'Games', url: '/games' },
  { icon: LucideLogOut, label: 'Logout', url: '/logout' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const user = useAtomValue(userAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (user?.fullname?.toLowerCase() === 'guest') {
      router.push('/');
    }
  }, []);

  return (
    <div className="flex h-full grow flex-col">
      <header className="bg-linear-to-b from-slate-200 to-transparent px-5 py-2.5">
        <InputGroup className="bg-background">
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
      <div className="grid w-full grid-cols-4 border-t">
        {navItems.map((nav, i) => {
          const isActive = pathname.startsWith(nav.url);
          const navClasses = cn(
            'flex flex-col items-center justify-center p-2',
            isActive && 'text-red-500 font-semibold'
          );
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
