import axios from 'axios';
import { io } from 'socket.io-client';

export const AUTH_TOKEN_NAME = 'ns_auth_token';

const baseURL = process.env.NEXT_PUBLIC_API || 'http://192.168.10.52:3005/api';
const socketURL = process.env.NEXT_SOCKET || 'http://192.168.10.52:3005';

const api = axios.create({ baseURL: baseURL.concat('/nkp-scores') });

function getAuthToken() {
  return typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_NAME) : null;
}

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export async function sendEmit(event: string) {
  const url = baseURL.concat('/socket');
  await axios.post(url, { event });
}

export const socket = io(socketURL, {
  extraHeaders: {
    'ngrok-skip-browser-warning': 'nkp',
  },
  transports: ['websocket'],
});

export default api;
