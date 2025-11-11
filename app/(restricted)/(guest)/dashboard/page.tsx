'use client';

import { cn } from '@/lib/utils';
import { socket } from '@/src/lib/api';
import errorHandler from '@/src/lib/error-handler';
import { keywordAtom, setLoading, toggleTrigger, triggerAtom } from '@/src/lib/jotai';
import scoreHistoryAPI from '@/src/services/history';
import teamsAPI from '@/src/services/teams';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { FaBookmark, FaTrophy } from 'react-icons/fa';
import { useImmer } from 'use-immer';
import styles from './dashboard.module.css';

export default function Page() {
  const [teams, setTeams] = useImmer<Team[]>([]);
  const [scoreDashboard, setScoreDashboard] = useImmer<ScoreDashboard[]>([]);
  const keyword = useAtomValue(keywordAtom);
  const trigger = useAtomValue(triggerAtom);

  const orderedByHighest = _.orderBy(scoreDashboard, 'score', 'desc');
  const topThreeTeam = _.take(orderedByHighest, 3);
  const restTeams = _(teams)
    .reject((a) => _.map(topThreeTeam, 'team_id').includes(a.id))
    .map((a) => {
      const score = _.find(scoreDashboard, ['team_id', a.id]);
      return { ...a, score };
    })
    .orderBy((a) => a?.score?.score ?? 0, 'desc')
    .value();

  const fetchAll = useCallback(async (keyword: string) => {
    try {
      setLoading(true);
      const tm = teamsAPI.get({ keyword });
      const sd = scoreHistoryAPI.dashboard();
      const [t, s] = await Promise.all([tm, sd]);
      setTeams(t);
      setScoreDashboard(s);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    fetchAll(keyword);
  }, [trigger, keyword]);

  useEffect(() => {
    const sub = socket.on('score', toggleTrigger);

    return () => {
      sub.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 p-5 pt-0 lg:mx-auto lg:w-6/12 lg:p-10">
      <p className="text-center text-lg font-bold uppercase">NKP Championship</p>

      {/* top three */}
      <div className="grid grid-cols-2 gap-x-4 lg:mx-auto lg:w-6/12">
        {topThreeTeam.map((item, i) => {
          const trophyClasses = cn(
            'size-8 drop-shadow-xl',
            i === 0 && 'text-yellow-400',
            i === 1 && 'text-slate-400',
            i === 2 && 'text-amber-800'
          );

          const parentClasses = cn(i === 0 && 'col-span-2', 'pt-5');

          const childClasses = cn(
            'flex flex-col items-center w-full gap-1 justify-center rounded-md border p-3 relative',
            i === 0 && 'w-6/12 mx-auto'
          );

          const team = _.find(teams, ['id', item.team_id]);

          return (
            <div className={parentClasses} key={i}>
              <div className={childClasses}>
                <div className="absolute -top-2 right-1 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute -mt-0.5 flex h-full w-full items-center justify-center font-semibold">
                      <small>{i + 1}</small>
                    </div>
                    <FaBookmark className="size-6 fill-yellow-400" />
                  </div>
                </div>
                <div className="flex w-full items-center justify-around">
                  <FaTrophy className={trophyClasses} />
                  <div className="text-center leading-1">
                    <p className="text-4xl font-black tabular-nums">
                      {item.score?.toLocaleString()}
                    </p>
                    <small className="text-muted-foreground font-light tabular-nums">
                      ( {item.value?.toLocaleString()} )
                    </small>
                  </div>
                </div>
                <div className="w-full leading-4">
                  <small className="text-muted-foreground">Nama Team:</small>
                  <p className="font-bold">{team?.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <table className={cn(styles?.table)}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Team</th>
            <th>Poin</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {restTeams.map((t, i) => {
            const baseNo = !!topThreeTeam.length ? 3 : 1;
            return (
              <tr>
                <td>{i + baseNo}</td>
                <td>{t?.name}</td>
                <td className="font-semibold tabular-nums">
                  {(t?.score?.value ?? 0).toLocaleString()}
                </td>
                <td className="font-semibold tabular-nums">
                  {(t?.score?.score ?? 0).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
