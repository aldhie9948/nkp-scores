import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendEmit, socket } from '@/src/lib/api';
import errorHandler from '@/src/lib/error-handler';
import { setLoading, toggleTrigger, userAtom } from '@/src/lib/jotai';
import StateManager from '@/src/lib/state-manager';
import scoreHistoryAPI from '@/src/services/history';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import { LucideSave, LucideXCircle } from 'lucide-react';
import { SyntheticEvent, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';

type Props = {
  setCurrentTeamId: Updater<string | null>;
  currentGame: Game | undefined;
  currentTeam: Team | undefined;
};

export default function ScoreForm({ currentGame, currentTeam, setCurrentTeamId }: Props) {
  const [open, setOpen] = useImmer(false);
  const [value, setValue] = useImmer(0);
  const setter = new StateManager();
  const user = useAtomValue(userAtom);

  const scores = currentGame?.score ?? [];
  const score =
    _.find(scores, (sc) => value >= sc.range_start && value <= sc.range_end)?.value ?? 0;

  const scoreNumbers = _(scores)
    .map((a) => {
      return [a.range_start, a.range_end];
    })
    .flatten()
    .value();

  const minScore = _.min(scoreNumbers);
  const maxScore = _.max(scoreNumbers);

  function reset() {
    setCurrentTeamId(null);
    setValue(0);
  }

  async function submit(e: SyntheticEvent) {
    try {
      e.preventDefault();
      setLoading(true);
      const data = {
        game_id: currentGame?.id ?? '',
        team_id: currentTeam?.id ?? '',
        score,
        value,
        ref: user?.fullname,
      } satisfies ScoreHistoryFormData;

      await scoreHistoryAPI.create(data);
      toggleTrigger();
      setOpen(false);

      sendEmit('score');
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    setOpen(!!currentGame && !!currentTeam);
  }, [currentGame, currentTeam]);

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Score Team Form</DialogTitle>
          <DialogDescription>
            Isi skor tim untuk permainan ini. Pastikan data akurat sebelum menyimpan.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <Label className="label-group">
            <p>Nama Permainan:</p>
            <Input type="text" required readOnly defaultValue={currentGame?.name} />
          </Label>
          <Label className="label-group">
            <p>Nama Team:</p>
            <Input type="text" required readOnly defaultValue={currentTeam?.name} />
          </Label>
          <Label className="label-group">
            <p>
              Nilai:{' '}
              <span className="text-red-500 tabular-nums">
                ( {minScore} - {maxScore} )
              </span>
            </p>
            <Input
              type="number"
              required
              placeholder="Masukkan nilai.."
              value={value}
              onChange={setter.input(setValue, null)}
              autoFocus
            />
          </Label>
          <div className="flex flex-col items-center justify-center">
            <p className="">Score</p>
            <p className="text-4xl font-bold tabular-nums">{score?.toLocaleString()}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">
                <LucideXCircle />
                <p>Close</p>
              </Button>
            </DialogClose>
            <Button type="submit">
              <LucideSave />
              <p>Simpan</p>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
