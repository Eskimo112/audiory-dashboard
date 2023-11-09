import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import CategoryPage from '@/screens/category/category.page';


const Page = () => <CategoryPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
