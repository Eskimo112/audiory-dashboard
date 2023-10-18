import { request } from './__base';

export default class UserService {
  static async getAll() {
    const url = 'users';

    const response = await request(url, 'get');
    if (!response.data) return [];
    return response.data;
  }

  static async getById(userId) {
    const url = `users/${userId}`;

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
