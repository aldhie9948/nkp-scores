import Confirmation from '@/components/confirmation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import errorHandler from '@/src/lib/error-handler';
import { setLoading, toggleTrigger } from '@/src/lib/jotai';
import teamsAPI from '@/src/services/teams';
import {
  LucideChevronDownCircle,
  LucideChevronUpCircle,
  LucideEdit2,
  LucideTrash2,
} from 'lucide-react';
import { useCallback } from 'react';
import { Updater, useImmer } from 'use-immer';

type Props = {
  team: Team;
  setTeam: Updater<Team | undefined>;
};

export default function TeamCard({ team, setTeam }: Props) {
  const [open, setOpen] = useImmer(false);

  const removeHandler = useCallback(async () => {
    try {
      setLoading(true);
      await teamsAPI.remove(team.id);
      toggleTrigger();
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2" onClick={() => setOpen(!open)}>
            <h1 className="font-semibold">{team.name}</h1>
            <Badge
              className="h-6 min-w-6 rounded-full bg-blue-500 px-1 font-mono text-white tabular-nums"
              variant="secondary"
            >
              {team.members.length}
            </Badge>
            <div className="grow"></div>
            {open ? <LucideChevronUpCircle /> : <LucideChevronDownCircle />}
          </button>
          {open && (
            <>
              {team.members.map((m, i) => {
                return (
                  <div key={m} className="grid grid-cols-12 gap-1">
                    <p className="tabular-nums">{i + 1}.</p>
                    <p className="col-span-11">{m}</p>
                  </div>
                );
              })}
              <div className="grid grid-cols-2 gap-2">
                <Confirmation onConfirm={removeHandler}>
                  <Button variant="secondary">
                    <LucideTrash2 />
                    <p>Hapus</p>
                  </Button>
                </Confirmation>
                <Button
                  variant="default"
                  onClick={() => {
                    setTeam(team);
                  }}
                >
                  <LucideEdit2 />
                  <p>Edit</p>
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
