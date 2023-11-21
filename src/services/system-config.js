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

  async deleteById(configId) {
    const url = `system-configs/${configId}`;

    const response = await request({
      url,
      method: 'delete',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getNextEffectiveByKey(key) {
    const url = `system-configs/next-effective/${key}`;

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
    };

    const response = await request({
      url,
      method: 'post',
      requestHeaders,
      payload: body,
    });
    if (!response.data) return null;
    return response.data;
  }
}
