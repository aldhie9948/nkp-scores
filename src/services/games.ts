import _ from 'lodash';
import api from '../lib/api';
import toastManager from '../lib/toast';

class GamesAPI {
  private baseUrl = '/games';

  async create(body: GameFormData) {
    const res = await api.post(this.baseUrl, body);
    toastManager.success('create');
    return res.data as SimpleResponseAPI;
  }

  async update(id: string, body: GameFormData) {
    const url = this.baseUrl.concat('/', id);
    const res = await api.put(url, body);
    toastManager.success('update');
    return res.data as SimpleResponseAPI;
  }

  async remove(id: string) {
    const url = this.baseUrl.concat('/', id);
    const res = await api.delete(url);
    toastManager.success('delete');
    return res.data as SimpleResponseAPI;
  }

  async get(params: ParamAPI = {}) {
    const res = await api.get(this.baseUrl, { params });
    const data = res.data as Game[];
    return _.orderBy(
      data,
      (d) => {
        const match = d.name.match(/^\d{1,}/g);
        if (!match) return d.name;
        const padded = _.padStart(match[0], String(data.length).length, '0');
        return padded;
      },
      'asc'
    );
  }
}

const gamesAPI = new GamesAPI();

export default gamesAPI;
