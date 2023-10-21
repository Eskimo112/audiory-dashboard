import { request } from './__base';

export default class GiftService {
  static async getAll() {
    const url = 'gifts';

    const response = await request(url, 'get');
    if (!response.data) return [];
    return response.data;
  }

  static async getById(giftId) {
    const url = `gifts/${giftId}`;

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
