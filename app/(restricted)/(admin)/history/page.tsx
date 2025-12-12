'use client';

import { Button } from '@/components/ui/button';
import styles from './history.module.css';
import errorHandler from '@/src/lib/error-handler';
import { keywordAtom, setLoading, toggleTrigger, triggerAtom } from '@/src/lib/jotai';
import scoreHistoryAPI from '@/src/services/history';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import { LucideChevronsLeft, LucideChevronsRight, LucideEdit, LucideTrash } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import Select from 'react-select';
import { cn } from '@/lib/utils';
import Confirmation from '@/components/confirmation';
import { sendEmit } from '@/src/lib/api';
import { Checkbox } from '@/components/ui/checkbox';
import { stat } from 'fs';

const showOpts = _([100, 200, 500])
  .map((a) => {
    let label = a.toString();
    return { value: a, label } satisfies SelectOptionType;
  })
  .value();

export default function Page() {
  const [take, setTake] = useImmer<number>(showOpts[0]?.value ?? 5);
  const [currentPage, setCurrentPage] = useImmer<number>(1);
  const keyword = useAtomValue(keywordAtom);
  const trigger = useAtomValue(triggerAtom);
  const skip = take * (currentPage - 1);
  const [scoreHistory, setScoreHistory] = useImmer<ScoreHistory[]>([]);
  const [checkAll, setCheckAll] = useImmer(false);
  const [historyIds, setHistoryIds] = useImmer<string[]>([]);

  const fetchAll = useCallback(
    _.debounce(async (params: ParamAPI = {}) => {
      try {
        setLoading(true);
        const sh = scoreHistoryAPI.get(params);
        const [s] = await Promise.all([sh]);
        setScoreHistory(s);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false, 1000);
      }
    }, 1000),
    []
  );

  function removeHandler(id: string) {
    return async () => {
      try {
        setLoading(true);
        await scoreHistoryAPI.remove(id);
        toggleTrigger();
        sendEmit('score');
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false, 1000);
      }
    };
  }

  const paginations = {
    increment() {
      setCurrentPage((i) => {
        return i + 1;
      });
    },
    decrement() {
      setCurrentPage((i) => {
        if (i === 1) return 1;
        else return i - 1;
      });
    },
  };

  async function batchRemoveHandler() {
    try {
      setLoading(true);
      await scoreHistoryAPI.batchRemove(historyIds);
      toggleTrigger();
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false, 1000);
    }
  }

  useEffect(() => {
    fetchAll({
      keyword,
      skip: skip.toString(),
      take: take.toString(),
      include: ['game', 'team'],
      order_index: 'created_at',
      order_sort: 'desc',
    });
  }, [trigger, keyword, take, currentPage]);

  useEffect(() => {
    const ids = _.map(scoreHistory, 'id');
    // xor mengembalikan elemen yang ada di salah satu array
    setCheckAll(_.xor(historyIds, ids).length === 0);
  }, [historyIds]);

  return (
    <div className="relative flex grow flex-col gap-2 px-5">
      <div className="sticky top-0 flex items-center justify-end gap-2 bg-linear-to-b from-white to-white/50">
        <p className="font-semibold">Show:</p>
        <div className="w-5/12 lg:w-2/12">
          <Select
            options={showOpts}
            value={_.find(showOpts, ['value', take])}
            onChange={(e) => {
              setTake(e?.value ?? 5);
              setCurrentPage(1);
            }}
          />
        </div>
        <Confirmation onConfirm={batchRemoveHandler}>
          <Button size="icon" variant="destructive" disabled={!historyIds.length}>
            <LucideTrash />
          </Button>
        </Confirmation>
      </div>
      <div className="grow">
        <table className={cn(styles?.table)}>
          <thead>
            <tr>
              <th>#</th>
              <th>
                <Checkbox
                  className="bg-white"
                  checked={checkAll}
                  onCheckedChange={(state) => {
                    setCheckAll(!checkAll);
                    const value = state ? _.map(scoreHistory, 'id') : [];
                    setHistoryIds(value);
                  }}
                />
              </th>
              <th>Game</th>
              <th>Team</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!scoreHistory.length ? (
              <tr>
                <td colSpan={99}>Tidak ada data.</td>
              </tr>
            ) : (
              <>
                {scoreHistory.map((item, i) => {
                  const baseNo = (currentPage - 1) * take;
                  const no = i + 1 + baseNo;
                  return (
                    <tr key={i}>
                      <td>{no}</td>
                      <td>
                        <Checkbox
                          className="bg-white"
                          checked={historyIds.includes(item.id)}
                          onCheckedChange={(state) => {
                            setHistoryIds((draft) => {
                              if (state) return _.concat(draft, [item.id]);
                              return _.without(draft, item.id);
                            });
                          }}
                        />
                      </td>
                      <td>{item.game_name}</td>
                      <td>{item.team_name}</td>
                      <td>{item.score.toLocaleString()}</td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <Confirmation onConfirm={removeHandler(item.id)}>
                            <Button size="icon" variant="destructive">
                              <LucideTrash />
                            </Button>
                          </Confirmation>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="sticky bottom-0 flex items-center justify-center gap-2 py-2">
        <Button disabled={currentPage === 1} onClick={paginations.decrement}>
          <LucideChevronsLeft />
          <p>Prev</p>
        </Button>
        <Button onClick={paginations.increment} disabled={take !== scoreHistory.length}>
          <p>Next</p>
          <LucideChevronsRight />
        </Button>
      </div>
    </div>
  );
}
