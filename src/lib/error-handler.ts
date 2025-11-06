import { AxiosError } from 'axios';
import toastManager from './toast';

export default function errorHandler(err: unknown) {
  let msg = 'Error occurred. Please try again later.';
  if (err instanceof AxiosError) {
    const data = err?.response?.data;
    msg = data?.error ?? 'Error occurred. Please try again later.';
  } else if (err instanceof Error) {
    msg = err.message;
  }
  toastManager.error(msg);
  return Promise.reject(msg);
}
