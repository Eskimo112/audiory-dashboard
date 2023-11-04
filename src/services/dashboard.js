import { request } from './__base';

export default class DashboardService {
  static async getStat() {
    const url = 'dashboard/stats';

    const response = await request({ url, method: 'get' });
    if (!response.data) return null;
    return response.data;
  }

  static async getRevenue(startDate, endDate) {
    const url = 'dashboard/revenue';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    if (!response.data) return null;
    return response.data;
  }

  static async getCategoriesRevenue(startDate, endDate) {
    const url = 'dashboard/categories/revenue';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    if (!response.data) return null;
    return response.data;
  }

  static async getPaidRatio(startDate, endDate) {
    const url = 'dashboard/paid-ratio';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    if (!response.data) return null;
    return response.data;
  }
}
