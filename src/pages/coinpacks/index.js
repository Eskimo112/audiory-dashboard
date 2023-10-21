import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import CoinPackPage from '../../screens/coin-pack/coinpack.page';

const Page = () => <CoinPackPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
