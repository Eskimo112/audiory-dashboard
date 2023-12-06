import { request } from './__base';

export default class ChapterVersionService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll({ chapterId }) {
    const url = `chapters/${chapterId}/chapter-version`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(chapterVersionId) {
    const url = `chapter-version/${chapterVersionId}`;
    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async getModerationId(chapterVersionId) {
    const url = `chapter-version/${chapterVersionId}/content-moderations`;
    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async updateModeration(chapterVersionId, body) {
    const url = `chapter-version/${chapterVersionId}/content-moderations`;
    const response = await request({
      url,
      method: 'put',
      payload: body,
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async create({ body }) {
    const url = `chapter-version`;
    const response = await request({
      url,
      method: 'post',
      payload: body,
      requestHeaders: this.requestHeader,
    });
    return response;
  }

  async revert({ chapterVersionId }) {
    const url = `chapter-version/revert/${chapterVersionId}`;
    const response = await request({
      url,
      method: 'post',
      requestHeaders: this.requestHeader,
    });

    return response;
  }
}
