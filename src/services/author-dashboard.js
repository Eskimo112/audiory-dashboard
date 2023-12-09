import { request } from './__base';

export default class AuthorDashboardService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getStat(startDate, endDate) {
    const url = 'author/stats';
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

  async getRevenue(startDate, endDate) {
    const url = 'author/revenue';

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

  async getReaderRanking() {
    const url = 'author/reader-ranking';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getStoryRanking(startDate, endDate, sortBy = 'total_read') {
    const url = 'author/story-ranking';

    const response = await request({
      url,
      method: 'get',
      params: {
        start_date: startDate,
        end_date: endDate,
        sort_by: sortBy,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getReaderTransactions(page = 1, pageSize = 10) {
    const url = 'author/reader-transactions';

    const response = await request({
      url,
      method: 'get',
      params: {
        page,
        page_size: pageSize,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }
}
