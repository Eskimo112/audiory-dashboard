import { toFormData } from 'axios';

import { request } from './__base';

export default class CoinPackService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'coin-packs';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(coinpackId) {
    const url = `coin-packs/${coinpackId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async deactivateById(coinpackId) {
    const url = `coin-packs/${coinpackId}/deactivate`;

    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async activateById(coinpackId) {
    const url = `coin-packs/${coinpackId}/activate`;

    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async update({ body, coinpackId }) {
    const url = `coin-packs/${coinpackId}`;
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

  async create({ body }) {
    const url = `coin-packs`;
    const requestHeaders = {
      ...this.requestHeader,
      'Content-Type': 'multipart/form-data',
    };

    const formData = toFormData(body);
    const response = await request({
      url,
      method: 'post',
      requestHeaders,
      payload: formData,
    });
    if (!response.data) return null;
    return response.data;
  }
}
