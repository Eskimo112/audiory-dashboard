import { request } from './__base';

export default class ChapterService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  static async getById(chapterId) {
    const url = `chapters/${chapterId}`;


    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    }); if (!response.data) return null;
    return response.data;
  }

  static async publish(chapterId) {
    const url = `chapters/publish/${chapterId}`;
    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }
}
