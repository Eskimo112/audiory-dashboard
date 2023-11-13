/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import GiftEditPage from '@/screens/admin/gift/gift-edit.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { gift_id } = router.query;
  if (!gift_id) throw PageNotFoundError;

  return <GiftEditPage giftId={gift_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
