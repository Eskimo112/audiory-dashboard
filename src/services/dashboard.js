import { request } from './__base';

export default class DashboardService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getStat() {
    const url = 'dashboard/stats';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getRevenue(startDate, endDate) {
    const url = 'dashboard/revenue';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getCategoriesRevenue(startDate, endDate) {
    const url = 'dashboard/categories/revenue';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getPaidRatio(startDate, endDate) {
    const url = 'dashboard/paid-ratio';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getStoryRanking(startDate, endDate, page, pageSize) {
    const url = 'dashboard/story-ranking';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
        page,
        page_size: pageSize,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }
}
