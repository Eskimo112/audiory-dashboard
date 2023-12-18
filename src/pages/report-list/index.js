/* eslint-disable camelcase */
import { useRouter } from 'next/router';

import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import ReportListPage from '@/screens/author/report-list/report-list.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { report_id } = router.query;

  return <ReportListPage reportId={report_id} />;
};

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
