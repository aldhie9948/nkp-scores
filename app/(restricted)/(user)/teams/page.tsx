'use client';
import errorHandler from '@/src/lib/error-handler';
import { keywordAtom, setLoading, triggerAtom } from '@/src/lib/jotai';
import teamsAPI from '@/src/services/teams';
import { useAtomValue } from 'jotai';
import { LucideUserX } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import TeamCard from './team-card';
import TeamsForm from './teams-form';
import _ from 'lodash';

export default function Page() {
  const [teams, setTeams] = useImmer<Team[]>([]);
  const [team, setTeam] = useImmer<Team | undefined>(undefined);
  const trigger = useAtomValue(triggerAtom);
  const keyword = useAtomValue(keywordAtom);

  const fetchAll = useCallback(
    _.debounce(async (params?: ParamAPI) => {
      try {
        setLoading(true);
        const t = await teamsAPI.get(params);
        setTeams(t);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false, 1000);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    fetchAll({ keyword });
  }, [trigger, keyword]);

  return (
    <>
      <div className="flex grow flex-col p-5 pt-0!">
        {!teams.length ? (
          <div className="text-muted-foreground flex h-full grow flex-col items-center justify-center">
            <LucideUserX className="size-14" />
            <p>Tidak ada team.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {teams.map((t) => {
              return <TeamCard team={t} setTeam={setTeam} key={t.id} />;
            })}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 px-5 pb-5">
        <TeamsForm team={team} setTeam={setTeam} />
      </div>
    </>
  );
}
