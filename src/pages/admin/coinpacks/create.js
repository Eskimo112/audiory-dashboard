import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import CoinPackCreatePage from '../../../screens/admin/coin-pack/coinpack-create.page';

const Page = ({ params }) => {
  return <CoinPackCreatePage />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
