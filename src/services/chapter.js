import { JWT_TOKEN } from '@/constants/token';

import { request } from './__base';

export default class ChapterService {
  static async getById(chapterId) {
    const url = `chapters/${chapterId}`;
    const reqHeaders = {
      'Authorization': `Bearer ${JWT_TOKEN}`
    }

    const response = await request(url, 'get', null, null, reqHeaders);
    if (!response.data) return null;
    return response.data;
  }

  static async publish(chapterId) {
    const url = `chapters/publish/${chapterId}`;
    const response = await request(url, 'post');
    if (!response.data) return null;
    return response.data;
  }
}
