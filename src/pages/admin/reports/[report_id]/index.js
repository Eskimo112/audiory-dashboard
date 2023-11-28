/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import ReportDetailPage from '@/screens/admin/report/report-detail.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { report_id } = router.query;
  if (!report_id) throw PageNotFoundError;

  return <ReportDetailPage reportId={report_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
