import { useAtomValue } from 'jotai';
import { Spinner } from './ui/spinner';
import { loadingAtom } from '@/src/lib/jotai';

export default function Loading() {
  const loading = useAtomValue(loadingAtom);
  if (loading)
    return (
      <div className="fixed inset-0 z-50">
        <div className="flex h-full w-full items-center justify-center backdrop-blur-sm">
          <Spinner className="size-10" />
        </div>
      </div>
    );
}
