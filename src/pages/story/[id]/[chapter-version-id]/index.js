import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import PreviewChapterPage from '@/screens/author/preview-chapter/preview-chapter.page';



const Page = () => <PreviewChapterPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;