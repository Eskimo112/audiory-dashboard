import { request } from './__base';

export default class TransactionService {
  static async getAll() {
    const url = 'transactions';

    const response = await request(url, 'get', null, {
      page: 1,
      page_size: Number.MAX_SAFE_INTEGER,
    });
    if (!response.data) return [];
    return response.data;
  }

  static async getById(transactionId) {
    const url = `transactions/${transactionId}`;

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
