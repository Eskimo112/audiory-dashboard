import { request } from './__base';

export default class CategoryService {
  static async getAll() {
    const url = 'categories';

    const response = await request(url, 'get');
    if (!response.data) return [];
    return response.data;
  }

  static async getById(categoryId) {
    const url = `categories/${categoryId}`;

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
