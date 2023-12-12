/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import ReportListPage from '@/screens/author/report-list/report-list.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { report_id } = router.query;
  if (!report_id) throw PageNotFoundError;

  return <ReportListPage reportId={report_id} />;
};

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
