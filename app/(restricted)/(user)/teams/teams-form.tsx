import OverlayScroll from '@/components/overlay-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import teamsAPI from '@/src/services/teams';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import { LucideCheckCircle, LucidePlus, LucideTrash } from 'lucide-react';
import { Fragment, SyntheticEvent, useCallback, useEffect } from 'react';
import { type SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Updater, useImmer } from 'use-immer';

type Props = {
  team?: Team;
  setTeam?: Updater<Team | undefined>;
};

export default function TeamsForm({ team, setTeam }: Props) {
  const [open, setOpen] = useImmer(false);
  const [form, setForm] = useImmer<TeamFormData>({
    name: '',
    members: [],
  });
  const loading = useAtomValue(loadingAtom);
  const setter = new StateManager();

  const _loadOptions = useCallback(async (keyword: string = '') => {
    try {
      const res = await teamsAPI.find({ keyword });
      const data = _(res)
        .groupBy('departemen')
        .entries()
        .map(([d, a]) => {
          const label = ['null', '0'].includes(d) ? 'LAINNYA' : d;
          const options = _(a)
            .map(({ fullname }) => {
              const name = fullname.toUpperCase();
              return { label: name, value: name } satisfies SelectOptionType;
            })
            .orderBy('label', 'asc')
            .value();

          return { label: label.toUpperCase(), options } satisfies SelectGroupType;
        })
        .value();
      return data as SelectGroupType[];
    } catch (error) {
      return [];
    }
  }, []);

  const loadOptions = _.debounce(_loadOptions, 1000);

  async function submit(e: SyntheticEvent) {
    try {
      e.preventDefault();
      setLoading(true);
      if (!!team) await teamsAPI.update(team.id, form);
      else await teamsAPI.create(form);
      toggleTrigger();
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setOpen(false);
        setLoading(false);
      }, 1000);
    }
  }

  function reset() {
    setForm({ name: '', members: [] });
    setTeam?.(undefined);
  }

  useEffect(() => {
    if (!!team) {
      const data = _.pick(team, ['name', 'members']);
      setForm(data);
      setOpen(true);
    }
  }, [team]);

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full" variant="default">
          <LucidePlus />
          <p>Buat team baru</p>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-dvh flex-col gap-0! overflow-hidden">
        <SheetHeader>
          <SheetTitle>Teams Form</SheetTitle>
          <SheetDescription>
            Buat atau perbarui tim. Tambah anggota, atur peran, dan konfigurasi.
          </SheetDescription>
        </SheetHeader>
        <form className="flex h-full grow flex-col overflow-hidden" onSubmit={submit}>
          <OverlayScroll>
            <div className="relative flex h-full grow flex-col gap-4 px-4 pb-4">
              <Label className="label-group">
                <p>Nama Team</p>
                <Input
                  placeholder="Masukkan nama team.."
                  required
                  value={form.name}
                  onChange={setter.input(setForm, 'name')}
                />
              </Label>
              <Label className="label-group">
                <p>Member</p>
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadOptions}
                  className="w-full"
                  isClearable
                  onChange={(data: SingleValue<SelectOptionType>) => {
                    if (!data?.value) return;
                    setForm((d) => {
                      d.members = _(d.members)
                        .concat(data?.value)
                        .uniq()
                        .orderBy((a, i) => i, 'desc')
                        .value();
                    });
                  }}
                />
              </Label>
              <Separator />
              <p className="text-sm font-semibold">Member Team</p>
              <div className="flex grow flex-col gap-2">
                {!form.members.length ? (
                  <small className="text-muted-foreground text-center">Belum ada member.</small>
                ) : (
                  <Fragment>
                    {form.members.map((m, i) => {
                      return (
                        <div
                          key={i}
                          className="grid grid-cols-12 items-center rounded-lg border p-2 text-sm"
                        >
                          <p className="tabular-nums">{i + 1}.</p>
                          <div className="col-span-11 flex items-center">
                            <p className="grow">{m}</p>
                            <Button
                              size="icon"
                              variant="destructive"
                              type="button"
                              onClick={() => {
                                setForm((d) => {
                                  d.members = _.without(d.members, m);
                                });
                              }}
                            >
                              <LucideTrash />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>
                )}
              </div>
              <Button
                className="sticky inset-x-4 bottom-2"
                disabled={!form.members.length || loading}
                type="submit"
              >
                <LucideCheckCircle />
                <p>Simpan</p>
              </Button>
            </div>
          </OverlayScroll>
        </form>
      </SheetContent>
    </Sheet>
  );
}
