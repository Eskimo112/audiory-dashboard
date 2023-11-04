import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import NewChapterPage from '@/screens/author/new-chapter/new-chapter.page';


const Page = () => <NewChapterPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;