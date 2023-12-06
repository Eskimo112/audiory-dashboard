import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import MyProfilePage from '../../screens/author/profile/my-profile.page';

const Page = () => <MyProfilePage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
