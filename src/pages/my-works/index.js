import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import MyStoryPage from '../../screens/author/my-story-list/my-story.page';

const Page = () => <MyStoryPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;