/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import SystemConfigDetailPage from '@/screens/admin/system-config/system-config-detail.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { config_id } = router.query;
  if (!config_id) throw PageNotFoundError;

  return <SystemConfigDetailPage configId={config_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
