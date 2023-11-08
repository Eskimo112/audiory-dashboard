import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import StoryPage from '../../../screens/story/story.page';

const Page = () => <StoryPage />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
