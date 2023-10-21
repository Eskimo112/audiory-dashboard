import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import SystemConfigPage from '../../screens/system-config/system-config.page';

const Page = () => <SystemConfigPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
