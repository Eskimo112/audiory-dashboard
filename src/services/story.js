import { request } from './__base';

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

  static async getById(storyId) {
    const url = `stories/${storyId}`;

    const response = await request({ url, method: 'get' });
    if (!response.data) return null;
    return response.data;
  }

  static async getMyStories(jwt) {
    console.log(jwt)
    const url = 'users/me/stories';

    const requestHeaders =
    {
      'Content-Type': "multipart/form-data",
      'Authorization': "Bearer " + jwt,
    }
    const response = await request(url, 'get', null, {
      page: 1,
      page_size: Number.MAX_SAFE_INTEGER,
    }, requestHeaders);
    if (!response.data) return [];
    return response.data;
  }

  static async create(body) {
    const requestHeaders =
    {
      'Content-Type': "multipart/form-data",
      'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTVlMTgxYmEtNGVlNy0xMWVlLWI3NDItMDI0MmMwYThiMDAyIiwiZnVsbF9uYW1lIjoiSG8gR2lhIE1hbiIsImF2YXRhcl91cmwiOiJodHRwczovL3Njb250ZW50LmZzZ24xMy00LmZuYS5mYmNkbi5uZXQvdi90MS42NDM1LTkvNTEwMzY1MjBfMjIzMzYxNjA2MzYzMjMyNF8xMjE0MDEwMDYxNDA4NDM2MjI0X24uanBnP19uY19jYXQ9MTEwXHUwMDI2Y2NiPTEtN1x1MDAyNl9uY19zaWQ9YmUzNDU0XHUwMDI2X25jX2V1aTI9QWVHd0FRSmtHRUNUQk9uay02Q1Y0Z1hHc0Fnc1ZxY29KVjJ3Q0N4V3B5Z2xYYTBWcU9CcFE1R2hhUEFSQ0drUHdkeGxaUkhvRUV5MWd1MzZ4dElWR1R1Vlx1MDAyNl9uY19vaGM9ZTEzV2xFT1FJS3NBWDlieGxSTFx1MDAyNl9uY19odD1zY29udGVudC5mc2duMTMtNC5mbmFcdTAwMjZvaD0wMF9BZkRNVHRFRHJPalpwb2gtR2FfaUt1V3NLd2xwRllQbjJkUktKU1hDN1dqZWhnXHUwMDI2b2U9NjU2NzU2MjciLCJ1c2VybmFtZSI6InphYWFhbWluIiwibGlicmFyeV9pZCI6ImE0NzcyZDZkLTU5NjUtMTFlZS1iNTNkLWUwZDRlOGExODA3NSIsInJvbGVfaWQiOjEsImxldmVsX2lkIjoxfQ.mBHIAAh2K0NKuejlSK5LkIJimDDOEbdzhZr7c57AANs",
    }
    const url = `stories`;
    const response = await request(url, 'post', body, null, requestHeaders);
    console.log('RES ', response.code)
    if (!response.code) return response.data;
    return response.data;



  }
}
