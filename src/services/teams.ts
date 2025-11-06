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
    return res.data as Team[];
  }
}

const teamsAPI = new TeamsAPI();

export default teamsAPI;
