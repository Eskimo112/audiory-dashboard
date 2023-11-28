import { request } from './__base';

export default class CommentService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getByParaId(paraId, offset = 0, limit = 10, sortBy = 'vote_count') {
    const url = `paragraphs/${paraId}/comments?offset=${offset}&limit=${limit}`;

    const response = await request({
      url,
      method: 'get',
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(commentId) {
    const url = `comments/${commentId}`;

    const response = await request({
      url,
      method: 'get',
    });
    if (!response.data) return [];
    return response.data;
  }

  async deleteById(commentId) {
    const url = `comments/${commentId}`;

    const response = await request({
      url,
      method: 'delete',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }
}
