import { request } from './__base';

export default class ChapterService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getById(chapterId) {
    const url = `chapters/${chapterId}/draft`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getChapterById(chapterId) {
    const url = `chapters/${chapterId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async publish(chapterId) {
    const url = `chapters/publish/${chapterId}`;
    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    return response;
  }

  async unpublish(chapterId) {
    const url = `chapters/unpublish/${chapterId}`;
    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });
    return response;
  }

  async create(body) {
    const url = `chapters`;
    const response = await request({
      url,
      method: 'post',
      payload: body,
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async delete(chapterId) {
    const url = `chapters/${chapterId}`;
    const response = await request({
      url,
      method: 'delete',
      requestHeaders: this.requestHeader,
    });
    return response;
  }
}
