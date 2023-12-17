import React from 'react';

import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ArrowForward } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useAuth } from '../../../hooks/use-auth';
import { useRequestHeader } from '../../../hooks/use-request-header';
import UserService from '../../../services/user';
import LoadingPage from '../../loading';
import { UserReadingList } from './user-reading-lists';
import { UserStories } from './user-stories';

const MyProfilePage = () => {
  const router = useRouter();
  const requestHeader = useRequestHeader();
  const { user: authUser } = useAuth();
  const { data: user = {}, isLoading } = useQuery(
    ['users', 'my-profile', authUser.id],
    async () => await new UserService(requestHeader).getById('me'),
  );
  const { data: userStories = [], isLoading: storiesLoading } = useQuery(
    ['users', 'my-profile', authUser.id, 'stories'],
    async () =>
      await new UserService(requestHeader).getStoriesByUserId(authUser.id),
    { enabled: !!authUser.id },
  );
  const { data: userReadinglist = [], isLoading: readingListLoading } =
    useQuery(
      ['users', 'my-profile', authUser.id, 'reading-lists'],
      async () =>
        await new UserService(requestHeader).getReadingListByUserId(
          authUser.id,
        ),
      { enabled: !!authUser.id },
    );

  if (isLoading) return <LoadingPage />;
  if (!user) throw PageNotFoundError;

  return (
    <>
      <Head>
        <title>Hồ sơ của tôi | Audiory</title>
      </Head>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Container
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 0,
          }}>
          <Stack
            spacing={1}
            width="100%"
            gap="20px"
            justifyContent="center"
            alignItems="center">
            <Stack
              sx={{
                width: '100%',
                height: '300px',
                bgcolor: 'sky.lighter',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'url("/assets/images/cover_image.png");',
              }}>
              <Stack justifyContent="center" alignItems="center" gap="8px">
                <Avatar
                  sx={{ width: '120px', height: '120px' }}
                  src={user.avatar_url}></Avatar>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={18}
                  lineHeight="20px">
                  {user.full_name}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={400}
                  fontSize={14}
                  lineHeight="16px"
                  fontStyle="italic">
                  {user.username}
                </Typography>

                <Stack direction="row" gap="12px" alignItems="center">
                  <Typography variant="body1" fontSize={15}>
                    <b>{userStories.length}</b> tác phẩm
                  </Typography>
                  |
                  <Typography variant="body1" fontSize={15}>
                    <b>{userReadinglist.length}</b> danh sách đọc
                  </Typography>
                  |
                  <Typography variant="body1" fontSize={15}>
                    <b>{user.followers.length}</b> người theo dõi
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Grid container width="70%" spacing={2}>
              {/* INTRODUCTION */}
              <Stack gap="12px" width="100%" alignItems="center" mb="24px">
                <Stack
                  width="80%"
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  position="relative">
                  <Typography variant="h6">Giới thiệu</Typography>
                  <Button
                    onClick={() => {
                      router.push('/profile/posts');
                    }}
                    variant="contained"
                    size="small"
                    color="info"
                    sx={{ position: 'absolute', right: 0 }}
                    endIcon={
                      <SvgIcon>
                        <ArrowForward />
                      </SvgIcon>
                    }>
                    Bài đăng
                  </Button>
                </Stack>
                <Stack
                  sx={(theme) => ({
                    width: '80%',
                    borderRadius: '8px',
                    boxShadow: theme.shadows[3],
                    padding: '12px',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'primary.lightest',
                  })}>
                  {user.description}
                </Stack>
              </Stack>
              <Divider sx={{ mb: '24px' }} />
              <Grid item xs={12} md={7}>
                <UserStories userId={authUser.id} />
              </Grid>
              <Grid item xs={12} md={5}>
                <UserReadingList userId={authUser.id} />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default MyProfilePage;
