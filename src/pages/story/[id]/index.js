import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import PreviewStoryPage from '@/screens/author/preview-story/preview-story.page';


const Page = () => <PreviewStoryPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
