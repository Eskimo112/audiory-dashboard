/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import StoryChapterPage from '@/screens/admin/story/chapters.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { story_id } = router.query;
  console.log(story_id);
  if (!story_id) throw PageNotFoundError;

  return <StoryChapterPage storyId={story_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
