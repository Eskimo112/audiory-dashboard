import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import CategoryCreatePage from '@/screens/admin/category/category-create.page';

const Page = ({ params }) => {
  return <CategoryCreatePage />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
