import { request } from './__base';

export default class SystemConfigService {
  static async getAll() {
    const url = 'system-configs';

    const response = await request(url, 'get');
    if (!response.data) return [];
    return response.data;
  }

  static async getById(configId) {
    const url = `system-configs/${configId}`;

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
