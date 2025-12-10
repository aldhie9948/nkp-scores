import { store, userAtom } from './jotai';

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
