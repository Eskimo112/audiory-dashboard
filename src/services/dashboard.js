import { request } from './__base';

export default class DashboardService {
  static async getStat() {
    const url = 'dashboard/stats';

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
