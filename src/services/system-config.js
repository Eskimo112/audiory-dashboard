import { toFormData } from 'axios';

import { request } from './__base';

export default class SystemConfigService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'system-configs';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(configId) {
    const url = `system-configs/${configId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getNextEffectiveById(configId) {
    const url = `system-configs/next-effective/${configId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async create({ body }) {
    const url = `system-configs`;
    const requestHeaders = {
      ...this.requestHeader,
      'Content-Type': 'multipart/form-data',
    };

    const formData = toFormData(body);
    console.log(formData);
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
