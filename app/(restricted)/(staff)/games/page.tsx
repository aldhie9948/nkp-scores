'use client';

import { useImmer } from 'use-immer';
import GamesForm from './games-form';
import { Fragment, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { keywordAtom, setLoading, triggerAtom } from '@/src/lib/jotai';
import gamesAPI from '@/src/services/games';
import errorHandler from '@/src/lib/error-handler';
import OverlayScroll from '@/components/overlay-scroll';
import { LucideBan } from 'lucide-react';
import GameCard from './game-card';

export default function Page() {
  const [games, setGames] = useImmer<Game[]>([]);
  const [game, setGame] = useImmer<Game | undefined>(undefined);
  const trigger = useAtomValue(triggerAtom);
  const keyword = useAtomValue(keywordAtom);

  useEffect(() => {
    setLoading(true);
    gamesAPI
      .get({ keyword, include: ['score'] })
      .then(setGames)
      .catch(errorHandler)
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, [trigger, keyword]);

  return (
    <>
      <div className="flex grow flex-col p-5 pt-0">
        {!games.length ? (
          <div className="text-muted-foreground flex min-h-full grow flex-col">
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
