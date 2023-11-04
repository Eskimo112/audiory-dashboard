import { request } from './__base';

export default class CoinPackService {
  static async getAll() {
    const url = 'coin-packs';

    const response = await request({ url, method: 'get' });
    if (!response.data) return [];
    return response.data;
  }

  static async getById(coinpackId) {
    const url = `coin-packs/${coinpackId}`;

    const response = await request({ url, method: 'get' });
    if (!response.data) return null;
    return response.data;
  }
}
