import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import GiftPage from '@/screens/admin/gift/gift.page';

const Page = () => <GiftPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
