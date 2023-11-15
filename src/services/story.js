import axios, { toFormData } from 'axios';

import { request } from './__base';
import { config } from 'process';

export default class StoryService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
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

  async getPaywalledCriteria(storyId) {
    const url = `stories/${storyId}/paywalled/assessment`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });

    return response;
  }

  async getById(storyId) {
    const url = `stories/${storyId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getMyStories() {
    const url = 'users/me/stories';
    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    console.log(response)
    if (!response.data) return [];
    return response.data;
  }

  async edit({ body, storyId }) {
    const url = `stories/${storyId}`;
    const requestHeaders = {
      // 'Content-Type': 'multipart/form-data',
      'Content-Type': 'application/x-www-form-urlencoded',
      ...this.requestHeader,
    };

    const formData = FormData(body);
    const response = axios.patch(`${process.env.API}${url}`, formData, { headers: requestHeaders });
    // const response = await request({
    //   url,
    //   method: 'patch',
    //   requestHeaders
    //   payload: formData,
    // });

    return response;
  }

  async create({ body, jwt }) {
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

  async delete(storyId) {
    const url = `stories/${storyId}`;
    const response = await request({ url, method: 'delete' });

    if (!response.code) return response.data;
    return response.data;
  }

  async paywall({ storyId, price }) {
    const url = `stories/${storyId}/paywalled/apply`;
    const response = await request({ url, method: 'post', payload: { 'chapter_price': price } });

    if (!response.code) return response.data;
    return response.data;
  }
}
