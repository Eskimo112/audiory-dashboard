import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import UserPage from '../../screens/user/user.page';

const Page = () => (
  <>
    <UserPage />
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
