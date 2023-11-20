/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import AuthorLevelEditPage from '@/screens/admin/level/author-level-edit.page';

const Page = () => {
  const router = useRouter();
  const { level_id } = router.query;
  if (!level_id) throw PageNotFoundError;

  return <AuthorLevelEditPage levelId={level_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
