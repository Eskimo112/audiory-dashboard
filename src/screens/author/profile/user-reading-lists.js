import React, { useMemo, useState } from 'react';

import { Box, Pagination, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '../../../hooks/use-request-header';
import UserService from '../../../services/user';

export const UserReadingList = ({ userId }) => {
  const requestHeader = useRequestHeader();

  const [page, setPage] = useState(1);
  const { data: userReadinglist = [], isLoading: readingListLoading } =
    useQuery(
      ['users', 'my-profile', userId, 'reading-lists'],
      async () =>
        await new UserService(requestHeader).getReadingListByUserId(userId),
      { enabled: !!userId },
    );

  const readingLists = useMemo(() => {
    return userReadinglist.slice((page - 1) * 4, page * 4);
  }, [page, userReadinglist]);

  return (
    <Stack gap="12px">
      <Typography variant="h6">
        Danh sách đọc ({userReadinglist.length})
      </Typography>
      <Stack direction="row" gap="12px">
        {readingLists.map((list) => (
          <Stack key={list.id} gap="8px">
            <Box
              component="img"
              alt="cover"
              src={list.cover_url}
              sx={{
                width: '115px',
                height: '160px',
                borderRadius: '8px',
              }}></Box>
            <Typography
              fontSize="14px"
              fontWeight={600}
              maxWidth="100px"
              textAlign="center">
              {list.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Stack alignItems="center" width="100%">
        <Pagination
          page={page}
          onChange={(e, page) => setPage(page)}
          count={Math.ceil(userReadinglist.length / 4)}></Pagination>
      </Stack>
    </Stack>
  );
};
