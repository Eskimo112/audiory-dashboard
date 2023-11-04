import { request } from './__base';

export default class ChapterVersionService {

    static async getAll(chapterId) {
        const url = `chapters/${chapterId}/chapter-version`;
        const response = await request(url, 'get');
        if (!response.data) return [];
        return response.data;
    }

    static async getById(chapterVersionId) {
        const url = `chapter-version/${chapterVersionId}`;
        const response = await request(url, 'get');
        if (!response.data) return null;
        return response.data;
    }



    static async create(body) {
        const url = `chapter-version`;
        const response = await request(url, 'post', body);
        if (!response.data) return null;
        return response.data;
    }

    static async revert({ chapterVersionId }) {
        const url = `chapter-version/revert/${chapterVersionId}`;
        const response = await request(url, 'post');
        if (!response.data) return null;
        return response.data;
    }
}
