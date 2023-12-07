import React, { useMemo, useState } from 'react';

import { Pagination, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import { StoryCard } from '../../../components/story-card';
import { useRequestHeader } from '../../../hooks/use-request-header';
import UserService from '../../../services/user';

export const UserStories = ({ userId }) => {
  const requestHeader = useRequestHeader();

  const [page, setPage] = useState(1);
  const { data: userStories = [], isLoading } = useQuery(
    ['users', 'my-profile', userId, 'stories'],
    async () => await new UserService(requestHeader).getStoriesByUserId(userId),
    { enabled: !!userId },
  );

  const stories = useMemo(() => {
    return userStories.slice((page - 1) * 4, page * 4);
  }, [page, userStories]);

  return (
    <Stack gap="16px">
      <Typography variant="h6">Tác phẩm ({userStories.length})</Typography>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
      <Stack alignItems="center" width="100%">
        <Pagination
          page={page}
          onChange={(e, page) => setPage(page)}
          count={Math.ceil(userStories.length / 4)}></Pagination>
      </Stack>
    </Stack>
  );
};
