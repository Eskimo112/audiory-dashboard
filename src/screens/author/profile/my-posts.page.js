import React, { useState } from 'react';

import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ArrowBack, MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  inputBaseClasses,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useAuth } from '../../../hooks/use-auth';
import { useRequestHeader } from '../../../hooks/use-request-header';
import CommentService from '../../../services/comment';
import UserService from '../../../services/user';
import { timeAgo } from '../../../utils/formatters';
import { toastError, toastSuccess } from '../../../utils/notification';
import LoadingPage from '../../loading';

const MyPostsPage = () => {
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
  const {
    data: userWall = [],
    isLoading: postsLoading,
    refetch,
  } = useQuery(
    ['users', 'my-profile', authUser.id, 'wall'],
    async () => await new UserService(requestHeader).getWallById(authUser.id),
    { enabled: !!authUser.id },
  );

  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmiting] = useState(false);

  const handleSubmitPost = async () => {
    setIsSubmiting(true);
    await new CommentService(requestHeader)
      .create({ text: value })
      .then(() => {
        toastSuccess('Tạo bài đăng thành công');
        refetch();
        setValue('');
      })
      .catch(() => {
        toastError('Đã có lỗi xảy ra. Vui lòng thử lại sau');
      })
      .finally(() => setIsSubmiting(false));
  };

  if (postsLoading || isLoading) return <LoadingPage />;
  if (!user) throw PageNotFoundError;

  return (
    <>
      <Head>
        <title>Bài đăng | Audiory</title>
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
                backgroundImage: `url(${
                  user.background_url || '/assets/images/cover_image.png'
                });`,
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
              <Stack gap="16px" width="100%">
                <Stack
                  direction="row"
                  width="100%"
                  position="relative"
                  justifyContent="center"
                  alignItems="center">
                  <Typography variant="h6">
                    Bài đăng của {user.full_name}
                  </Typography>
                  <Button
                    onClick={() => router.push('/profile/me')}
                    variant="text"
                    sx={{ position: 'absolute', left: 0 }}
                    startIcon={
                      <SvgIcon>
                        <ArrowBack />
                      </SvgIcon>
                    }>
                    Quay lại hồ sơ
                  </Button>
                </Stack>
                {/* POST */}
                <Stack
                  sx={(theme) => ({
                    gap: '16px',
                    boxShadow: theme.shadows[2],
                    borderRadius: 2,
                    padding: '16px',
                    alignItems: 'end',
                  })}>
                  <Stack width="100%" direction="row" gap="12px">
                    <Avatar
                      sx={{ width: '40px', height: '40px' }}
                      src={user.avatar_url}></Avatar>
                    <Stack direction="column" gap="12px" sx={{ flexGrow: 1 }}>
                      <TextField
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        variant="outlined"
                        placeholder="Đăng gì đó lên tường"
                        multiline
                        rows={3}
                        sx={{
                          border: 'none',
                          [`.${inputBaseClasses.root}`]: {
                            bgcolor: 'sky.lightest',
                            padding: '10px 12px',
                            border: 'none',
                          },
                        }}
                      />
                      <Button
                        disabled={isSubmitting}
                        onClick={() => {
                          handleSubmitPost();
                        }}
                        variant="contained"
                        color="info"
                        fullWidth
                        sx={{
                          borderRadius: 1,
                          padding: '6px 12px',
                          fontSize: '14px',
                        }}>
                        Đăng
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
                <Divider />
                {/* PAST POSTS */}
                <Stack gap="12px">
                  {userWall.map((post) => {
                    return (
                      <Stack
                        key={post.id}
                        direction="row"
                        sx={(theme) => ({
                          gap: '16px',
                          boxShadow: theme.shadows[2],
                          borderRadius: 2,
                          padding: '16px',
                        })}>
                        <Avatar
                          sx={{ width: '40px', height: '40px' }}
                          src={post.user.avatar_url}></Avatar>
                        <Stack gap="12px" width="100%">
                          <Stack
                            direction="row"
                            width="100%"
                            justifyContent="space-between">
                            <Stack>
                              <Typography fontSize="15px" fontWeight={600}>
                                {post.user.full_name}
                              </Typography>
                              <Typography fontSize="13px" fontStyle="italic">
                                {timeAgo(post.created_date)}
                              </Typography>
                            </Stack>
                            <IconButton
                              sx={{ color: 'ink.lighter', fontSize: '14px' }}>
                              <MoreVert />
                            </IconButton>
                          </Stack>
                          <Divider />
                          <Typography variant="body2" fontSize="16px">
                            {post.text}
                          </Typography>
                          <Stack direction="row" gap="12px">
                            <Typography
                              fontSize="14px"
                              fontWeight={600}
                              sx={{ color: 'primary.main' }}>
                              {post.like_count ?? 0} lượt thích
                            </Typography>
                            <Typography
                              fontSize="14px"
                              fontWeight={600}
                              sx={{ color: 'secondary.main' }}>
                              {post.children.length ?? 0} bình luận
                            </Typography>
                          </Stack>
                          <Divider />

                          <Stack direction="row" gap="12px">
                            <Avatar
                              sx={{ width: '35px', height: '35px' }}
                              src={post.user.avatar_url}></Avatar>
                            <TextField
                              variant="outlined"
                              placeholder="Bình luận gì đó"
                              rows={2}
                              sx={{
                                flexGrow: 1,
                                border: 'none',
                                [`.${inputBaseClasses.input}`]: {
                                  //   bgcolor: 'sky.lightest',
                                  padding: '10px 12px',
                                  border: 'none',
                                },
                              }}
                            />
                          </Stack>
                          <Stack gap="12px">
                            {post.children.slice(0, 3).map((comment) => (
                              <Stack
                                key={comment.id}
                                sx={{
                                  padding: '12px',
                                  bgcolor: 'sky.lightest',
                                  borderRadius: '4px',
                                  gap: '8px',
                                }}>
                                <Stack direction="row" gap="12px">
                                  <Avatar
                                    sx={{ width: '30px', height: '30px' }}
                                    src={comment.user.avatar_url}></Avatar>
                                  <Stack>
                                    <Typography
                                      fontSize="13px"
                                      fontWeight={600}>
                                      {comment.user.full_name}
                                    </Typography>
                                    <Typography
                                      fontSize="11px"
                                      fontStyle="italic">
                                      {timeAgo(comment.created_date)}
                                    </Typography>
                                  </Stack>
                                </Stack>
                                <Typography variant="body2">
                                  {comment.text}
                                </Typography>
                                {/* <Stack direction="row" gap="8px">
                                  <Button
                                    variant="text"
                                    sx={{
                                      color: 'ink.lighter',
                                      fontWeight: 600,
                                      padding: '4px',
                                      lineHeight: '14px',
                                      minWidth: 0,
                                    }}>
                                    Thích
                                  </Button>
                                  <Button
                                    variant="text"
                                    sx={{
                                      color: 'ink.lighter',
                                      fontWeight: 600,
                                      padding: '4px',
                                      lineHeight: '14px',
                                      minWidth: 0,
                                    }}>
                                    Trả lời
                                  </Button>
                                  <Button
                                    variant="text"
                                    sx={{
                                      color: 'ink.lighter',
                                      fontWeight: 600,
                                      padding: '4px',
                                      lineHeight: '14px',
                                      minWidth: 0,
                                    }}>
                                    Báo cáo
                                  </Button>
                                </Stack> */}
                              </Stack>
                            ))}
                          </Stack>
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default MyPostsPage;
