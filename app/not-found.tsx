import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Not Found</h1>
      <p className="text-muted-foreground">Could not find requested resource.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
