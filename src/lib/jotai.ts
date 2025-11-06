import { atom, createStore } from 'jotai';
export const store = createStore();
export const loadingAtom = atom<boolean>(false);
export const userAtom = atom<User | null>(null);
export const triggerAtom = atom<boolean>(false);
export const keywordAtom = atom<string>('');

export const setLoading = (value: boolean) => {
  store.set(loadingAtom, value);
};

store.set(loadingAtom, false);
store.set(userAtom, null);
store.set(triggerAtom, false);
store.set(keywordAtom, '');

export const toggleTrigger = () => {
  store.set(triggerAtom, !store.get(triggerAtom));
};
