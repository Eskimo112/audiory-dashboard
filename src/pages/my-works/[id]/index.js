import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import NewStoryPage from '@/screens/author/new-story/new-story.page';


const Page = () => <NewStoryPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;