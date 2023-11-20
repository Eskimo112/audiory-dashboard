import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import AuthorLevelCreatePage from '@/screens/admin/level/author-level-create.page';

const Page = () => <AuthorLevelCreatePage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
