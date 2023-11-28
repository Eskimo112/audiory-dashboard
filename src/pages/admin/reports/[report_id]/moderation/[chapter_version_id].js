/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import ChapterModerationPage from '@/screens/admin/report/chapter-moderation.page';

const Page = ({ params }) => {
  const router = useRouter();
  const { chapter_version_id } = router.query;
  if (!chapter_version_id) throw PageNotFoundError;

  return <ChapterModerationPage chapterVersionId={chapter_version_id} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
