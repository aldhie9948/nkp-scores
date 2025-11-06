import { ChangeEvent } from 'react';
import { Updater } from 'use-immer';

class StateManager {
  private pattern = '';

  restrict(regex: string) {
    this.pattern = regex;
    return this;
  }

  input<U>(dispatch: Updater<U>, field: keyof U) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      let value: any = e.target.value;
      const type = e.target.type;

      if (type === 'text' && this.pattern) {
        const regex = new RegExp(this.pattern, 'g');
        value = value.replaceAll(regex, '');
      } else if (type === 'number') {
        value = Number(value);
      }

      dispatch((draft) => {
        if (field !== null) (draft as any)[field] = value;
        else draft = value;
      });
    };
  }
}

export default StateManager;
