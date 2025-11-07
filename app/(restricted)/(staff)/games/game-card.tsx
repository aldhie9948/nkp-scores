import { Card, CardContent } from '@/components/ui/card';
import {
  LucideChevronDown,
  LucideChevronUp,
  LucideEdit2,
  LucideGamepad2,
  LucideTrash2,
} from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { Updater, useImmer } from 'use-immer';
import styles from './game.module.css';
import { useMemo } from 'react';
import _ from 'lodash';
import { Button } from '@/components/ui/button';
import Confirmation from '@/components/confirmation';
import gamesAPI from '@/src/services/games';
import { toggleTrigger } from '@/src/lib/jotai';

type Props = {
  game: Game;
  setGame?: Updater<Game | undefined>;
};

export default function GameCard({ game, setGame }: Props) {
  const [open, setOpen] = useImmer(false);
  const scores = useMemo(() => {
    return _.orderBy(game?.score ?? [], 'value', 'asc');
  }, [game]);

  async function removeHandler() {
    try {
      await gamesAPI.remove(game.id);
      toggleTrigger();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="space-y-2">
          <button
            className="flex w-full cursor-pointer items-center gap-2"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <LucideGamepad2 className="size-8 text-blue-500" />
            <div className="grow text-left leading-4">
              <small className="text-muted-foreground">Nama Permainan:</small>
              <p className="font-semibold">{game.name}</p>
            </div>
            {open ? <LucideChevronUp /> : <LucideChevronDown />}
          </button>

          {open && (
            <div className="mt-5 flex flex-col gap-4">
              <p className="font-semibold">Detail Scores:</p>
              <table className={styles?.table}>
                <thead>
                  <tr>
                    <th rowSpan={2}>No.</th>
                    <th colSpan={2}>Range</th>
                    <th rowSpan={2}>Score</th>
                  </tr>
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {!game.score?.length ? (
                    <tr>
                      <td colSpan={99} className="text-center">
                        Tidak ada scores.
                      </td>
                    </tr>
                  ) : (
                    <Fragment>
                      {scores.map((s, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{s.range_start}</td>
                            <td>{s.range_end}</td>
                            <td>{s.value}</td>
                          </tr>
                        );
                      })}
                    </Fragment>
                  )}
                </tbody>
              </table>
              <div className="grid grid-cols-2 gap-2">
                <Confirmation onConfirm={removeHandler}>
                  <Button variant="secondary">
                    <LucideTrash2 />
                    <p>Hapus</p>
                  </Button>
                </Confirmation>
                <Button variant="default" onClick={() => setGame?.(game)}>
                  <LucideEdit2 />
                  <p>Edit</p>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
