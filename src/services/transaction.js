import { request } from './__base';

export default class TransactionService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'transactions';

    const response = await request({
      url,
      method: 'get',
      params: {
        page: 1,
        page_size: Number.MAX_SAFE_INTEGER,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(transactionId) {
    const url = `transactions/${transactionId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }
}
