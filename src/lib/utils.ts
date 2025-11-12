import { store, userAtom } from './jotai';

export function allowedAccess(roles: UserRole[], onError: (e?: any) => any) {
  const user = store.get(userAtom);
  if (user) {
    if (roles.includes(user.role)) return;
    else onError();
  }
}
