import { toFormData } from 'axios';

import { request } from './__base';

export default class CategoryService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'categories';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];

    return response.data;
  }

  async getById(categoryId) {
    const url = `categories/${categoryId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async deleteById(categoryId) {
    const url = `categories/${categoryId}`;

    const response = await request({
      url,
      method: 'delete',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async update({ body, categoryId }) {
    const url = `categories/${categoryId}`;
    const requestHeaders = {
      'Content-Type': 'multipart/form-data',
      ...this.requestHeader,
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
    const url = `categories`;
    const requestHeaders = {
      'Content-Type': 'multipart/form-data',
      ...this.requestHeader,
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
