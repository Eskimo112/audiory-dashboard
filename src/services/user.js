import { request } from './__base';

export default class UserService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'users';
    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(userId) {
    const url = `users/${userId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getStoriesByUserId(userId) {
    const url = `users/${userId}/stories`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }
}
