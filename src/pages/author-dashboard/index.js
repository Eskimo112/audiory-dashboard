import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import AuthorDashboardPage from '../../screens/author-dashboard/author-dashboard.page';

const Page = () => <AuthorDashboardPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
