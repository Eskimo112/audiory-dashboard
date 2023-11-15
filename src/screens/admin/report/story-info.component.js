import React from 'react';

import { useRouter } from 'next/router';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';

const StoryInfo = ({ storyId, isReversed }) => {
  const requestHeader = useRequestHeader();
  const { data: story, isLoading } = useQuery(['story', storyId], () =>
    new StoryService(requestHeader).getById(storyId),
  );
  const router = useRouter();
  if (isLoading) return <CircularProgress />;
  return (
    <Stack
      sx={{ cursor: 'pointer' }}
      alignItems="center"
      direction={isReversed ? 'row-reverse' : 'row'}
      spacing={1}
      maxWidth="100px"
      onClick={() => {
        router.push(`/admin/stories/${storyId}`);
      }}>
      <Box component="img" src={story.cover_url} width={40} height={53}></Box>
      <Stack alignItems="start">
        <Typography
          variant="subtitle2"
          overflow="hidden"
          textOverflow="ellipsis">
          {story.title ?? 'Không có tên'}
        </Typography>
        {/* <Typography variant="subtitle2" fontStyle="italic" color="ink.lighter">
          {story.author.full_name ?? 'Không có username'}
        </Typography> */}
      </Stack>
    </Stack>
  );
};

export default StoryInfo;
