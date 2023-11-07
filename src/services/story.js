import axios from 'axios';
import { request } from './__base';
import { config } from 'process';

export default class StoryService {
  static async getAll() {
    const url = 'stories';

    const response = await request({
      url,
      method: 'get',
      params: {
        page: 1,
        page_size: Number.MAX_SAFE_INTEGER,
      },
    });
    if (!response.data) return [];
    return response.data;
  }

  static async getById({ storyId, jwt }) {
    const url = `stories/${storyId}`;
    const requestHeaders =
    {
      'Authorization': "Bearer " + jwt,
    }
    const response = await request({ url, method: 'get', requestHeaders });
    if (!response.data) return null;
    return response.data;
  }

  static async getMyStories(jwt) {

    const url = 'users/me/stories';

    const requestHeaders =
    {
      'Authorization': "Bearer " + jwt,
    }

    const response = await request({
      url,
      method: 'get',
      requestHeaders,
    });
    if (!response.data) return [];
    return response.data;
  }

  static async edit({ body, jwt }) {
    const requestHeaders =
    {
      'Content-Type': "multipart/form-data",
      'Authorization': "Bearer " + jwt,
    }
    const url = `stories`;

    const response = await axios.patch(url, body, { requestHeaders });
    if (!response.code) return null;
    return response.data;
  }

  static async create({ body, jwt }) {
    const requestHeaders =
    {
      'Content-Type': "multipart/form-data",
      'Authorization': "Bearer " + jwt,
    }
    const url = `stories`;
    const response = await request({ url, method: 'post', payload: body, requestHeaders });

    if (!response.code) return response.data;
    return response.data;

  }

  static async delete(storyId) {

    const url = `stories/$storyId`;
    const response = await request({ url, method: 'delete' });

    if (!response.code) return response.data;
    return response.data;

  }

}
