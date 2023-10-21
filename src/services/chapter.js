import { request } from './__base';

export default class ChapterService {
  static async getById(chapterId) {
    const url = `chapters/${chapterId}`;

    const response = await request(url, 'get');
    if (!response.data) return null;
    return response.data;
  }
}
