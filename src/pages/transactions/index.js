import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import TransactionPage from '../../screens/transaction/transaction.page';

const Page = () => <TransactionPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
