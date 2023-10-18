/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import UserEditPage from '../../screens/user/user-edit.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { user_id } = router.query;
  if (!user_id) throw PageNotFoundError;

  return <UserEditPage userId={user_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
