import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import EditStoryPage from '@/screens/author/edit-story/edit-story.page';


const Page = () => <EditStoryPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
