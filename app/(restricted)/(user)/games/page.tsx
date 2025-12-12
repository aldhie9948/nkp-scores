'use client';

import errorHandler from '@/src/lib/error-handler';
import { keywordAtom, setLoading, triggerAtom } from '@/src/lib/jotai';
import gamesAPI from '@/src/services/games';
import { useAtomValue } from 'jotai';
import { LucideBan } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import GameCard from './game-card';
import GamesForm from './games-form';
import _ from 'lodash';

export default function Page() {
  const [games, setGames] = useImmer<Game[]>([]);
  const [game, setGame] = useImmer<Game | undefined>(undefined);
  const trigger = useAtomValue(triggerAtom);
  const keyword = useAtomValue(keywordAtom);

  const fetchAll = useCallback(
    _.debounce(async (params: ParamAPI) => {
      try {
        setLoading(true);
        const g = await gamesAPI.get(params);
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
    fetchAll({ keyword, include: ['score'] });
  }, [trigger, keyword]);

  return (
    <>
      <div className="flex grow flex-col p-5 pt-0">
        {!games.length ? (
          <div className="text-muted-foreground flex h-full grow flex-col items-center justify-center">
            <LucideBan />
            <p>Tidak ada permainan terdaftar.</p>
          </div>
        ) : (
          <div className="flex h-full grow flex-col gap-2">
            {games.map((game) => {
              return <GameCard key={game.id} game={game} setGame={setGame} />;
            })}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 px-5 pb-5">
        <GamesForm game={game} setGame={setGame} />
      </div>
    </>
  );
}
