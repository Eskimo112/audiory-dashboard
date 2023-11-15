import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import MyProfilePage from '@/screens/admin/my-profile/my-profile.page';

const Page = () => <MyProfilePage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
