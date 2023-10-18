import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import DashboardPage from '../screens/dashboard/dashboard.page';

const Page = () => (
  <>
    <DashboardPage />
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
