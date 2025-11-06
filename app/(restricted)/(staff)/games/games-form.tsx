import OverlayScroll from '@/components/overlay-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import errorHandler from '@/src/lib/error-handler';
import { loadingAtom, setLoading, toggleTrigger } from '@/src/lib/jotai';
import StateManager from '@/src/lib/state-manager';
import gamesAPI from '@/src/services/games';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import {
  LucideArrowBigDown,
  LucideArrowBigUp,
  LucideBan,
  LucideCheckCircle,
  LucideMinus,
  LucidePlus,
  LucidePlusSquare,
  LucideTrash2,
} from 'lucide-react';
import { ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';

type Props = {
  game?: Game;
  setGame?: Updater<Game | undefined>;
};

export default function GamesForm({ game, setGame }: Props) {
  const [open, setOpen] = useImmer(false);
  const [form, setForm] = useImmer<GameFormData>({
    name: '',
    scores: [],
  });
  const loading = useAtomValue(loadingAtom);
  const setter = new StateManager();

  function scoresHandler(index: number, field: keyof GameFormData['scores'][number]) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      const regex = new RegExp('\D+', 'gi');
      const formatted = value.replaceAll(regex, '');
      setForm((draft) => {
        const target = draft.scores[index];
        if (!!target) target[field] = Number(formatted);
      });
    };
  }

  async function submit(e: SyntheticEvent) {
    try {
      e.preventDefault();
      setLoading(true);
      if (!!game) await gamesAPI.update(game.id, form);
      else await gamesAPI.create(form);
      toggleTrigger();
    } catch (err) {
      errorHandler(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 1000);
    }
  }

  function reset() {
    setForm({ name: '', scores: [] });
    setGame?.(undefined);
  }

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  useEffect(() => {
    if (!!game) {
      const { name, scores } = game;
      setForm((d) => {
        d.name = name;
        if (scores) {
          const data = _.map(scores, (a) => _.pick(a, ['range_start', 'range_end', 'value']));
          d.scores = data;
        }
      });
      setOpen(true);
    }
  }, [game]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">
          <LucidePlus />
          <p>Buat permainan baru</p>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-dvh flex-col gap-0! overflow-hidden">
        <SheetHeader>
          <SheetTitle>Games Form</SheetTitle>
          <SheetDescription>Buat permainan baru dengan mengisi formulir ini.</SheetDescription>
        </SheetHeader>
        <form
          className="relative flex h-full grow flex-col gap-4 overflow-hidden"
          onSubmit={submit}
        >
          <OverlayScroll>
            <div className="flex h-full grow flex-col gap-4 px-4">
              <Label className="label-group">
                <p>Nama Permainan</p>
                <Input
                  placeholder="Masukkan nama permainan.."
                  required
                  value={form.name}
                  onChange={setter.input(setForm, 'name')}
                />
              </Label>
              <p className="font-semibold">Score Ranges</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setForm((d) => {
                    const data = { range_end: 0, range_start: 0, value: 0 };
                    d.scores = [...d.scores, data];
                    _.reverse(d.scores);
                  });
                }}
              >
                <LucidePlusSquare />
                <p>Tambah Skor</p>
              </Button>
              {!form.scores.length ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center">
                  <LucideBan />
                  <p>Belum ada scores</p>
                </div>
              ) : (
                <>
                  {form.scores.map((a, i) => {
                    return (
                      <fieldset key={i} className="field">
                        <legend>Score #{a.value}</legend>
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="label-group">
                            <p>Mulai</p>
                            <Input
                              type="number"
                              placeholder="10, 100.."
                              value={form.scores[i].range_start}
                              onChange={scoresHandler(i, 'range_start')}
                              required
                            />
                          </Label>
                          <Label className="label-group">
                            <p>Akhir</p>
                            <Input
                              type="number"
                              placeholder="10, 100.."
                              value={form.scores[i].range_end}
                              onChange={scoresHandler(i, 'range_end')}
                              required
                            />
                          </Label>
                          <Label className="label-group col-span-2">
                            <p>Skor</p>
                            <Input
                              type="number"
                              placeholder="1, 2, 3.."
                              value={form.scores[i].value}
                              onChange={scoresHandler(i, 'value')}
                              required
                            />
                          </Label>
                          <Button
                            variant="destructive"
                            className="col-span-2"
                            type="button"
                            onClick={() => {
                              setForm((draft) => {
                                draft.scores = _.reject(draft.scores, (a, b) => b === i);
                              });
                            }}
                          >
                            <LucideTrash2 />
                            <p>Hapus</p>
                          </Button>
                        </div>
                      </fieldset>
                    );
                  })}
                </>
              )}
            </div>
          </OverlayScroll>
          <div className="px-4 pb-4">
            <Button className="w-full" type="submit" disabled={!form.scores.length || loading}>
              <LucideCheckCircle />
              <p>Simpan</p>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
