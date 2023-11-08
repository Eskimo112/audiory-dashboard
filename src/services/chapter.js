import { request } from './__base';

export default class ChapterService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  static async getById({ chapterId, jwt }) {
    const url = `chapters/${chapterId}`;
    const requestHeaders =
    {
      'Authorization': "Bearer " + jwt,
    }
    const response = await request({
      url,
      method: 'get',
      requestHeaders,
    }); if (!response.data) return null;
    return response.data;
  }

  static async publish(chapterId) {
    const url = `chapters/publish/${chapterId}`;
    const response = await request({
      url,
      method: 'post',
    });
    return response;
  }

  static async create(body) {
    const url = `chapters`;
    const response = await request({
      url,
      method: 'post',
      payload: body
    });
    if (!response.data) return null;
    return response.data;
  }
}
