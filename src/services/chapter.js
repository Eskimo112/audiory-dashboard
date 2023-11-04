import { request } from './__base';

export default class ChapterService {
  static async getById(chapterId) {
    const url = `chapters/${chapterId}`;

    const response = await request({ url, method: 'get' });
    if (!response.data) return null;
    return response.data;
  }
}
