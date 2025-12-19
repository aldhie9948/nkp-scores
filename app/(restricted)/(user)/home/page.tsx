'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import errorHandler from '@/src/lib/error-handler';
import { keywordAtom, setLoading, triggerAtom } from '@/src/lib/jotai';
import toastManager from '@/src/lib/toast';
import gamesAPI from '@/src/services/games';
import teamsAPI from '@/src/services/teams';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import { LucideBan, LucideCheckCircle, LucideFlag, LucideUsers } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { PiUsersFourDuotone } from 'react-icons/pi';
import { TbHandFinger } from 'react-icons/tb';
import Select from 'react-select';
import { useImmer } from 'use-immer';
import ScoreForm from './score-form';
import { FaBaseballBall, FaBasketballBall, FaUsers } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const NS_CURRENT_GAME_KEY = 'ns_current_game';

export default function Page() {
  const [teams, setTeams] = useImmer<Team[]>([]);
  const [games, setGames] = useImmer<Game[]>([]);
  const trigger = useAtomValue(triggerAtom);
  const keyword = useAtomValue(keywordAtom);
  const gamesOpts = _(games)
    .map((g) => {
      const label = g.name;
      const value = g.id;
      return { label, value } satisfies SelectOptionType;
    })
    .orderBy((g) => {
      const match = g.label.match(/^\d{2,}/gi);
      if (!match) return g.label;
      return match[0];
    }, 'asc')
    .value();

  const [currentGameId, setCurrentGameId] = useImmer<string | null>(null);
  const [currentTeamId, setCurrentTeamId] = useImmer<string | null>(null);
  const currentGame = _.find(games, ['id', currentGameId]);
  const currentTeam = _.find(teams, ['id', currentTeamId]);
  const currentGameOpt = _.find(gamesOpts, ['value', currentGameId]);
  const teamsGroupByCompletion = useMemo(() => {
    return _(teams)
      .groupBy((t) => {
        const isDone = _.some(t?.score_history, { game_id: currentGameId });
        const key = isDone ? 'DONE' : 'YET';
        return key;
      })
      .toPairs()
      .orderBy(([key]) => key, 'desc')
      .value();
  }, [teams, currentGameId]);

  const fetchAll = useCallback(
    _.debounce(async (keyword: string) => {
      try {
        setLoading(true);
        const tm = teamsAPI.get({ include: ['score_history'], keyword });
        const gm = gamesAPI.get({ include: ['score'] });
        const [t, g] = await Promise.all([tm, gm]);

        setTeams(t);
        setGames(g);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false, 1000);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    fetchAll(keyword);
  }, [trigger, keyword]);

  useEffect(() => {
    if (window) {
      const localCurrentGame = window.localStorage.getItem(NS_CURRENT_GAME_KEY);
      setCurrentGameId(localCurrentGame);
    }
  }, []);

  return (
    <>
      <div className="flex grow flex-col gap-4 pt-0">
        <div className="space-y-2 px-5 lg:px-1.5">
          <p className="font-semibold">Pilih Permainan:</p>
          <Select
            options={gamesOpts}
            value={currentGameOpt}
            className="z-20"
            onChange={(ev) => {
              const value = ev?.value ?? null;
              setCurrentGameId(value);
              !!value && window.localStorage.setItem(NS_CURRENT_GAME_KEY, value);
            }}
          />
          <div className="flex items-center rounded-lg border bg-linear-to-b from-slate-50 to-slate-50/50 p-5">
            <div className="grow">
              <small className="text-muted-foreground">Permainan sekarang: </small>
              <p className="text-lg font-semibold">{currentGame?.name ?? '-'}</p>
            </div>
            <FaBasketballBall className="size-8 animate-bounce text-blue-500" />
          </div>
        </div>
        <div className="flex h-full grow flex-col gap-4 px-5 pb-5">
          {!games.length ? (
            <div className="text-muted-foreground col-span-2 flex grow flex-col items-center gap-2 italic">
              <LucideBan />
              <p>Tidak ada team.</p>
            </div>
          ) : (
            <>
              {teamsGroupByCompletion.map(([key, items]) => {
                const isDone = key === 'DONE';
                const label = isDone ? 'Completed Teams' : 'Ongoing Teams';
                const headerClasses = cn(
                  'col-span-2 flex items-center gap-1 rounded-lg border p-3 shadow',
                  isDone && 'bg-green-100 text-green-500 border-green-500',
                  !isDone && 'bg-blue-100 text-blue-500 border-blue-500'
                );
                return (
                  <div className="grid grid-cols-2 gap-2" key={key}>
                    <div className={headerClasses}>
                      <LucideFlag size="1rem" />
                      <p>{label}</p>
                    </div>
                    {items.map((team, i) => {
                      const scoreHistory = team?.score_history ?? [];
                      const scoreHistoryByGameId = _.filter(scoreHistory, [
                        'game_id',
                        currentGameId,
                      ]);
                      const score = _.sumBy(scoreHistoryByGameId, 'score');
                      const value = _.sumBy(scoreHistoryByGameId, 'value');
                      return (
                        <div key={i} className="relative h-full w-full">
                          {isDone && (
                            <LucideCheckCircle className="absolute top-2 right-2 fill-green-100 text-green-500" />
                          )}
                          <button
                            key={team.id}
                            disabled={isDone}
                            className="h-full w-full cursor-pointer disabled:cursor-not-allowed disabled:grayscale"
                            onClick={() => {
                              if (!currentGame)
                                toastManager.error('Silahkan pilih permainan dahulu.');
                              else setCurrentTeamId(team.id);
                            }}
                          >
                            <Card className="p-4!">
                              <CardContent className="flex w-full flex-col items-center justify-center gap-2 px-0!">
                                <LucideUsers className="size-6 self-center fill-green-100 text-green-500" />
                                <div className="flex flex-col text-center leading-4">
                                  <small className="text-muted-foreground">Nama Team:</small>
                                  <p className="inline-block text-xs font-semibold break-all whitespace-pre-line">
                                    {team.name}
                                  </p>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-center gap-1 text-blue-500">
                                  <TbHandFinger />
                                  <small className="text-center">Click to add score</small>
                                </div>
                                <div className="hidden flex-col">
                                  <small className="text-muted-foreground">Nilai:</small>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="leading-2">
                                      <p className="text-lg tabular-nums">
                                        {score.toLocaleString()}
                                      </p>
                                      <small>Score</small>
                                    </div>
                                    <div className="leading-2">
                                      <p className="text-lg tabular-nums">
                                        {value.toLocaleString()}
                                      </p>
                                      <small>Poin</small>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
      <ScoreForm {...{ currentGame, currentTeam, setCurrentTeamId }} />
    </>
  );
}
