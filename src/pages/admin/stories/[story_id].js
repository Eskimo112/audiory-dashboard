/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import StoryEditPage from '@/screens/admin/story/story-edit.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { story_id } = router.query;
  if (!story_id) throw PageNotFoundError;

  return <StoryEditPage userId={story_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
