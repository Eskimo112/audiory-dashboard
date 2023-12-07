import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import MyPostsPage from '../../screens/author/profile/my-posts.page';

const Page = () => <MyPostsPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
