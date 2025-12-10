import api from '../lib/api';
import toastManager from '../lib/toast';

class ScoreHistoryAPI {
  private baseUrl = '/history';

  async create(data: ScoreHistoryFormData) {
    const res = await api.post(this.baseUrl, data);
    toastManager.success('create');
    return res.data as SimpleResponseAPI;
  }

  async update(id: string, data: ScoreHistoryFormData) {
    const url = this.baseUrl.concat('/', id);
    const res = await api.put(url, data);
    toastManager.success('update');
    return res.data as SimpleResponseAPI;
  }

  async remove(id: string) {
    const url = this.baseUrl.concat('/', id);
    const res = await api.delete(url);
    toastManager.success('delete');
    return res.data as SimpleResponseAPI;
  }

  async batchRemove(ids: string[]) {
    const url = this.baseUrl.concat('/delete-batch');
    const res = await api.post(url, ids);
    toastManager.success('delete');
    return res.data as SimpleResponseAPI;
  }

  async get(params: ParamAPI = {}) {
    const res = await api.get(this.baseUrl, { params });
    return res.data as ScoreHistory[];
  }

  async dashboard() {
    const url = this.baseUrl.concat('/dashboard');
    const res = await api.get(url);
    return res.data as ScoreDashboard[];
  }
}

const scoreHistoryAPI = new ScoreHistoryAPI();

export default scoreHistoryAPI;
