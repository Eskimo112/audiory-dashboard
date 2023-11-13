/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import CoinpackEditPage from '@/screens/admin/coin-pack/coinpack-edit.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { coinpack_id } = router.query;
  if (!coinpack_id) throw PageNotFoundError;

  return <CoinpackEditPage coinpackId={coinpack_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
