import { toFormData } from 'axios';
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
      params: {
        offset: 0,
        limit: 1000,
      },
    });
    if (!response.data) return [];
    return response.data;
  }

  async getReadingListByUserId(userId) {
    const url = `users/${userId}/reading-lists`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getReportsByUserId(userId, page) {
    const url = `users/${userId}/reports`;

    const response = await request({
      url,
      method: 'get',
      params: {
        page,
        page_size: 10,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getNotificationByUserId(offset) {
    const url = `notifications`;

    const response = await request({
      url,
      method: 'get',
      params: {
        offset,
        limit: 10,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async updateNotificationById(id, body) {
    const url = `notifications/${id}`;

    const response = await request({
      url,
      method: 'put',
      payload: body,
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getWallById(userId) {
    const url = `users/${userId}/wall`;

    const response = await request({
      url,
      method: 'get',
      params: {
        offset: 0,
        limit: 100,
      },
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

  async edit({ body, userId }) {
    const url = `users/${userId}/profile`;
    const requestHeaders = {
      'Content-Type': 'multipart/form-data',
      ...this.requestHeader,
    };

    const formData = toFormData(body);
    const response = await request({
      url,
      method: 'put',
      requestHeaders,
      payload: formData,
    });

    return response;
  }
}
