import React from 'react';

import { useRouter } from 'next/router';

import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import ChapterService from '../../services/chapter';
import StoryService from '../../services/story';

const ChapterInfo = ({ chapterId }) => {
  const { data: chapter, isLoading: chapterLoading } = useQuery(
    ['chapter', chapterId],
    () => ChapterService.getById(chapterId),
  );
  const { data: story, isLoading: storyLoading } = useQuery(
    ['chapter', chapterId],
    () => StoryService.getById(chapter?.story_id),
    { enabled: !!chapter?.story_id },
  );
  const router = useRouter();
  if (chapterLoading || storyLoading) return <CircularProgress />;
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={2}
      onClick={() => {
        router.push(`/chapters/${chapterId}`);
      }}>
      <Avatar src={story.cover_url} width={50} height={50}></Avatar>
      <Stack alignItems="start">
        <Typography variant="subtitle2">
          {story.title ?? 'Không có tên'}
        </Typography>
        <Typography variant="subtitle2" fontStyle="italic" color="ink.lighter">
          {chapter.title ?? 'Không có tên'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ChapterInfo;
