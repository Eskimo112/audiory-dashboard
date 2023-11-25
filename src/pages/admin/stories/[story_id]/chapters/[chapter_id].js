/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import ChapterDetailPage from '@/screens/admin/story/chapter-detail.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { story_id, chapter_id } = router.query;
  if (!story_id) throw PageNotFoundError;
  if (!chapter_id) throw PageNotFoundError;

  return <ChapterDetailPage storyId={story_id} chapterId={chapter_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
