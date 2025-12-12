import _ from 'lodash';
import api from '../lib/api';
import toastManager from '../lib/toast';

class TeamsAPI {
  private baseUrl = '/teams';

  async find(params: ParamAPI = {}) {
    const url = this.baseUrl.concat('/find');
    const res = await api.get(url, { params });
    return res.data as Employee[];
  }

  async create(body: TeamFormData) {
    const res = await api.post(this.baseUrl, body);
    toastManager.success('create');
    return res.data as SimpleResponseAPI;
  }

  async update(id: string, body: TeamFormData) {
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
    const data = res.data as Team[];
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

const teamsAPI = new TeamsAPI();

export default teamsAPI;
