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

  async deactivateById(userId) {
    const url = `users/${userId}/deactivate`;

    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async activateById(userId) {
    const url = `users/${userId}/activate`;

    const response = await request({
      url,
      method: 'post',
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

  async getTransactionsByUserId(userId) {
    const url = `users/${userId}/transactions`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }
}
