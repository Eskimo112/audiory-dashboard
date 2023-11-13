import React from 'react';

import { useRouter } from 'next/router';

import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';

const UserInfo = ({ userId, isReversed }) => {
  const requestHeader = useRequestHeader();
  const { data: user = {}, isLoading } = useQuery(['user', userId], () =>
    new UserService(requestHeader).getById(userId),
  );
  const router = useRouter();
  if (isLoading) return <CircularProgress />;
  return (
    <Stack
      alignItems="center"
      direction={isReversed ? 'row-reverse' : 'row'}
      spacing={1}
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        router.push(`/admin/users/${userId}`);
      }}>
      <Avatar
        src={user.avatar_url}
        sx={{ width: '40px', height: '40px' }}></Avatar>
      <Stack alignItems="start">
        <Typography variant="subtitle2">
          {user.full_name ?? 'Không có tên'}
        </Typography>
        <Typography variant="subtitle2" fontStyle="italic" color="ink.lighter">
          {user.username ?? 'Không có username'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default UserInfo;
