'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import errorHandler from '@/src/lib/error-handler';
import { setLoading, toggleTrigger, triggerAtom } from '@/src/lib/jotai';
import authAPI from '@/src/services/auth';
import { useAtomValue } from 'jotai';
import { LucideArrowRight, LucideCoffee, LucideInfo, LucideSchool } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect } from 'react';
import { useImmer } from 'use-immer';

export default function Page() {
  const router = useRouter();
  const [fullname, setFullname] = useImmer('');
  const trigger = useAtomValue(triggerAtom);
  const [msg, setMsg] = useImmer('');

  const handleLogin =
    ({ asGuest = false }: { asGuest: boolean }) =>
    async (e: SyntheticEvent) => {
      try {
        e.preventDefault();

        const data: AuthFormData = {
          fullname: asGuest ? 'guest' : fullname,
        };

        await authAPI.login(data);

        setMsg('Login successfully. Redirecting..');

        toggleTrigger();
      } catch (error) {
        const err = errorHandler(error);
        setMsg(err);
      }
    };

  useEffect(() => {
    authAPI.verify().then((data) => {
      setMsg('Login successfully. Redirecting..');
      const target = ['guest', 'admin'].includes(data.role) ? '/dashboard' : '/home';
      setTimeout(() => {
        router.push(target);
      }, 1000);
    });
  }, [trigger]);
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 overflow-hidden">
      <form
        className="flex w-full grow flex-col items-center justify-center gap-4 px-10 lg:w-3/12 lg:border-x"
        onSubmit={handleLogin({ asGuest: false })}
      >
        <LucideSchool size="3rem" className="text-red-500" />
        <h1 className="text-lg font-bold">Welcome to NKP Score App</h1>
        <Separator className="my-2" />
        {!!msg && (
          <Alert variant="default">
            <LucideInfo />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>{msg}</AlertDescription>
          </Alert>
        )}
        <Label className="label-group w-full">
          <p>Nama Lengkap</p>
          <Input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            type="text"
            placeholder="Masukkan nama lengkap anda.."
            required
            onFocus={() => setMsg('')}
          />
        </Label>
        <Button className="w-full" type="submit">
          <p>Login</p>
          <LucideArrowRight />
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          type="button"
          onClick={handleLogin({ asGuest: true })}
        >
          <LucideCoffee size="1rem" />
          <p>Login as Guest</p>
        </Button>
      </form>
    </div>
  );
}
