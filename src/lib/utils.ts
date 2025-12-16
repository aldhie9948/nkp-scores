import { store, userAtom } from './jotai';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import inBetween from 'dayjs/plugin/isBetween';

dayjs.locale('id');
dayjs.extend(customParseFormat);
dayjs.extend(inBetween);

export const day = dayjs;

export function allowedAccess(roles: UserRole[], onError: (e?: any) => any) {
  const user = store.get(userAtom);
  if (user) {
    if (roles.includes(user.role)) return;
    else onError();
  }
}

export function teamsSortHandler(team: Team) {
  const match = team.name.match(/^\d*/g);
  if (!match) return match;
  return Number(match[0]);
}
