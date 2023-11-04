import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import AuthorDashboardPage from '../../screens/author-dashboard/author-dashboard.page';

const Page = () => <AuthorDashboardPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
