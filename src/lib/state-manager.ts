import { ChangeEvent } from 'react';
import { Updater } from 'use-immer';

class StateManager {
  private pattern = '';

  restrict(regex: string) {
    this.pattern = regex;
    return this;
  }

  input<U>(dispatch: Updater<U>, field: keyof U | null) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value, type } = e.target;
      let newValue: any = value;

      if (type === 'text' && this.pattern) {
        const regex = new RegExp(this.pattern, 'g');
        newValue = newValue.replaceAll(regex, '');
      } else if (type === 'number') {
        // Biarkan kosong tetap string agar user bisa hapus isi input
        if (value === '') newValue = '';
        // Hanya ubah ke number jika valid
        else if (!isNaN(Number(value))) newValue = Number(value);
      }

      if (field) {
        dispatch((draft) => {
          (draft as any)[field] = newValue;
        });
      } else {
        dispatch(newValue);
      }
    };
  }
}

export default StateManager;
