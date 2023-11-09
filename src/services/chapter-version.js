import { request } from './__base';

export default class ChapterVersionService {

    static async getAll({ chapterId, jwt }) {
        const url = `chapters/${chapterId}/chapter-version`;
        const requestHeaders =
        {
            'Authorization': "Bearer " + jwt,
        }
        const response = await request({ url, method: 'get', requestHeaders });
        if (!response.data) return [];
        return response.data;
    }

    static async getById(chapterVersionId) {
        const url = `chapter-version/${chapterVersionId}`;
        const response = await request({ url, method: 'get' });
        if (!response.data) return null;
        return response.data;
    }


    static async create({ body, jwt }) {
        const url = `chapter-version`;
        const requestHeaders =
        {
            'Authorization': "Bearer " + jwt,
        }
        const response = await request({ url, method: 'post', payload: body, requestHeaders });
        return response;
    }

    static async revert({ chapterVersionId }) {
        const url = `chapter-version/revert/${chapterVersionId}`;
        const response = await request({ url, method: 'post' });
        if (!response.data) return null;
        return response.data;
    }
}
