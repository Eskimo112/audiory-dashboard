import { toFormData } from 'axios';

import { request } from './__base';

export default class LevelService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAllAuthor() {
    const url = 'author-levels';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getAllReader() {
    const url = 'levels';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getAuthorLevelById(levelId) {
    const url = `author-levels/${levelId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async updateAuthorLevel({ body, levelId }) {
    const url = `author-levels/${levelId}`;
    const requestHeaders = {
      ...this.requestHeader,
      'Content-Type': 'multipart/form-data',
    };

    const formData = toFormData(body);
    const response = await request({
      url,
      method: 'put',
      requestHeaders,
      payload: formData,
    });
    if (!response.data) return null;
    return response.data;
  }

  async createAuthorLevel({ body }) {
    const url = `author-levels`;
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

  async deleteAuthorLevel(levelId) {
    const url = `author-levels/${levelId}}`;

    const response = await request({
      url,
      method: 'delete',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }
}
