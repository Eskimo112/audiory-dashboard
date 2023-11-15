import { toFormData } from 'axios';

import { request } from './__base';

export default class GiftService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'gifts';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(giftId) {
    const url = `gifts/${giftId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async deactivateById(giftId) {
    const url = `gifts/${giftId}/deactivate`;

    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async activateById(giftId) {
    const url = `gifts/${giftId}/activate`;

    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async update({ body, giftId }) {
    const url = `gifts/${giftId}`;
    const requestHeaders = {
      ...this.requestHeader,
      'Content-Type': 'multipart/form-data',
    };

    const formData = toFormData(body);
    const response = await request({
      url,
      method: 'patch',
      requestHeaders,
      payload: formData,
    });
    if (!response.data) return null;
    return response.data;
  }
}
