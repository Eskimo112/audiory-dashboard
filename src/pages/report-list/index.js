import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import ReportListPage from '@/screens/author/report-list/report-list.page';

const Page = () => <ReportListPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
