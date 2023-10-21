import React from 'react';

import { useRouter } from 'next/router';

import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import StoryService from '../../services/story';

const StoryInfo = ({ userId: storyId }) => {
  const { data: story, isLoading } = useQuery(['story', storyId], () =>
    StoryService.getById(storyId),
  );
  const router = useRouter();
  if (isLoading) return <CircularProgress />;
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={2}
      onClick={() => {
        router.push(`/stories/${storyId}`);
      }}>
      <Avatar src={story.cover_url} width={50} height={50}></Avatar>
      <Stack alignItems="start">
        <Typography variant="subtitle2">
          {story.title ?? 'Không có tên'}
        </Typography>
        <Typography variant="subtitle2" fontStyle="italic" color="ink.lighter">
          {story.author.full_name ?? 'Không có username'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default StoryInfo;
