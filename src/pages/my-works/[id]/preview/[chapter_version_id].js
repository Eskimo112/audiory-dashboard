/* eslint-disable camelcase */
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

import { Layout as AuthorLayout } from 'src/layouts/author/layout';

import PreviewChapterPage from '@/screens/author/preview-chapter/preview-chapter.page';

const Page = () => {
  const router = useRouter();
  const { chapter_version_id } = router.query;
  console.log(chapter_version_id);
  if (!chapter_version_id) throw PageNotFoundError;
  return <PreviewChapterPage chapterVersionId={chapter_version_id} />;
};

Page.getLayout = (page) => <AuthorLayout>{page}</AuthorLayout>;

export default Page;
