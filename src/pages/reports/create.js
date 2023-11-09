/* eslint-disable camelcase */

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import ReportCreatePage from '@/screens/admin/report/report-create.page';

const Page = ({ params }) => {
  return <ReportCreatePage />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
