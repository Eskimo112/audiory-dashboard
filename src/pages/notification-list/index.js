import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import ReportListPage from '@/screens/author/report-list/report-list.page';

import NotificationListPage from '../../screens/author/notification-list/notification-list.page';

const Page = () => <NotificationListPage />;

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
