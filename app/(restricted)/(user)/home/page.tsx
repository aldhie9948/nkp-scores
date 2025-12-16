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
import { LucideBan } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { PiUsersFourDuotone } from 'react-icons/pi';
import { TbHandFinger } from 'react-icons/tb';
import Select from 'react-select';
import { useImmer } from 'use-immer';
import ScoreForm from './score-form';

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
        <div className="sticky top-0 space-y-2 px-5 backdrop-blur-lg lg:px-1.5">
          <p className="font-semibold">Pilih Permainan:</p>
          <Select
            options={gamesOpts}
            value={currentGameOpt}
            onChange={(ev) => {
              const value = ev?.value ?? null;
              setCurrentGameId(value);
              !!value && window.localStorage.setItem(NS_CURRENT_GAME_KEY, value);
            }}
          />
        </div>
        <div className="flex h-full grow flex-col gap-2 px-5 pb-5">
          <p className="col-span-2 font-semibold">Daftar Team:</p>
          {!games.length ? (
            <div className="text-muted-foreground col-span-2 flex grow flex-col items-center gap-2 italic">
              <LucideBan />
              <p>Tidak ada team.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team, i) => {
                const scoreHistory = team?.score_history ?? [];
                const scoreHistoryByGameId = _.filter(scoreHistory, ['game_id', currentGameId]);
                const score = _.sumBy(scoreHistoryByGameId, 'score');
                const value = _.sumBy(scoreHistoryByGameId, 'value');
                return (
                  <Button
                    key={team.id}
                    asChild
                    variant="outline"
                    className="h-full cursor-pointer"
                    onClick={() => {
                      if (!currentGame) toastManager.error('Silahkan pilih permainan dahulu.');
                      else setCurrentTeamId(team.id);
                    }}
                  >
                    <Card className="p-4!">
                      <CardContent className="flex w-full flex-col items-center justify-center gap-2 px-0!">
                        <PiUsersFourDuotone className="size-8 self-center" />
                        <div className="flex flex-col text-center leading-4">
                          <small className="text-muted-foreground">Nama Team:</small>
                          <p className="inline-block font-semibold break-all whitespace-pre-line">
                            {team.name}
                          </p>
                        </div>
                        <div className="hidden flex-col leading-4">
                          <small className="text-muted-foreground">Anggota:</small>
                          <Badge variant="outline" className="border-blue-500 bg-blue-100">
                            {team.members.length} members
                          </Badge>
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
                              <p className="text-lg tabular-nums">{score.toLocaleString()}</p>
                              <small>Score</small>
                            </div>
                            <div className="leading-2">
                              <p className="text-lg tabular-nums">{value.toLocaleString()}</p>
                              <small>Poin</small>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ScoreForm {...{ currentGame, currentTeam, setCurrentTeamId }} />
    </>
  );
}
