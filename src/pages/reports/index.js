import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import ReportPage from '../../screens/report/report.page';

const Page = () => <ReportPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
