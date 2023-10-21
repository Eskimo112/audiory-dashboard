import React from 'react';

import { useRouter } from 'next/router';

import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';

import UserService from '../../services/user';

const UserInfo = ({ userId }) => {
  const { data: user, isLoading } = useQuery(['user', userId], () =>
    UserService.getById(userId),
  );
  const router = useRouter();
  if (isLoading) return <CircularProgress />;
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={1}
      onClick={() => {
        router.push(`/users/${userId}`);
      }}>
      <Avatar src={user.avatar_url} width={50} height={50}></Avatar>
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
