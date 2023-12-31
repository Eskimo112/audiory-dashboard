import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import LevelPage from '@/screens/admin/level/level.page';

const Page = () => <LevelPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
