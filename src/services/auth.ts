import api, { AUTH_TOKEN_NAME } from '../lib/api';
import { store, userAtom } from '../lib/jotai';
import toastManager from '../lib/toast';

class AuthAPI {
  private baseUrl = '/auth';

  async login(data: AuthFormData) {
    const res = await api.post(this.baseUrl, data);
    const token = res.data as string;
    if (typeof window !== undefined) {
      localStorage.setItem(AUTH_TOKEN_NAME, token);
    }
    toastManager.success('login');
    return token;
  }

  logout() {
    if (typeof window !== undefined) localStorage.removeItem(AUTH_TOKEN_NAME);
    toastManager.success('logout');
  }

  async verify() {
    const url = this.baseUrl.concat('/verify');
    const res = await api.get(url);
    const data = res.data as User;
    store.set(userAtom, data);
    return data;
  }
}

const authAPI = new AuthAPI();

export default authAPI;
