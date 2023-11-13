/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import CategoryEditPage from '@/screens/admin/category/category-edit.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { category_id } = router.query;
  if (!category_id) throw PageNotFoundError;

  return <CategoryEditPage categoryId={category_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
