import { toFormData } from 'axios';

import { request } from './__base';

export default class StoryService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  static async getAll() {
    const url = 'stories';

    const response = await request({
      url,
      method: 'get',
      params: {
        page: 1,
        page_size: Number.MAX_SAFE_INTEGER,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  static async getById(storyId) {
    const url = `stories/${storyId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  static async getMyStories() {
    const url = 'users/me/stories';

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  static async edit({ body, storyId }) {
    const url = `stories/${storyId}`;
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

    return response;
  }

  static async create({ body, jwt }) {
    const requestHeaders = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + jwt,
    };
    const url = `stories`;
    const response = await request({
      url,
      method: 'post',
      payload: body,
      requestHeaders,
    });

    if (!response.code) return response.data;
    return response.data;
  }

  static async delete(storyId) {
    const url = `stories/${storyId}`;
    const response = await request({ url, method: 'delete' });

    if (!response.code) return response.data;
    return response.data;
  }
}
