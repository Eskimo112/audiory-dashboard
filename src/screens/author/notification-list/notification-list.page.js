import React, { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';

import { useAuth } from '../../../hooks/use-auth';
import { timeAgo } from '../../../utils/formatters';
import LoadingPage from '../../loading';

const NotificationListPage = () => {
  const requestHeader = useRequestHeader();
  const { user } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const {
    data: response = {},
    isLoading,
    refetch,
  } = useQuery(
    ['user', user.id, 'notification', page],
    async () =>
      await new UserService(requestHeader).getNotificationByUserId(
        (page - 1) * 10,
      ),
    { refetchOnWindowFocus: false, enabled: Boolean(user.id) },
  );

  const handleOnClickNoti = async (id) => {
    await new UserService(requestHeader)
      .updateNotificationById(id, { is_read: true })
      .then(() => {
        refetch();
      });
  };

  if (isLoading) return <LoadingPage />;

  const notis = response.data ?? [];
  const totalPage = response.total_page ?? 0;
  return (
    <>
      <Head>
        <title>Thông báo | Audiory</title>
      </Head>
      <div style={{ width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Container
            maxWidth="xl"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginY: 4,
            }}>
            <Grid container xs={12} md={6}>
              <Stack
                spacing={1}
                width="100%"
                gap="20px"
                justifyContent="center"
                alignItems="center">
                <Stack sx={{ marginY: 1, fontStyle: 'italic' }}>
                  <Typography variant="h4">Danh sách thông báo</Typography>
                </Stack>

                <Stack gap="8px">
                  {notis.map((noti, index) => {
                    return (
                      <Button
                        fullWidth
                        key={index}
                        variant="text"
                        onClick={() => {
                          handleOnClickNoti(noti.id);
                          if (noti.activity.action_type === 'RESPONDED') {
                            router.push(
                              `/report-list?report_id=${noti.activity.entity_id}`,
                            );
                            return;
                          }
                          if (noti.activity.entity_type === 'STORY') {
                            router.push(`/my-works/${noti.activity.entity_id}`);
                            return;
                          }
                          // show no support dialog
                        }}
                        sx={{
                          cursor: 'pointer',
                          textAlign: 'left',
                          justifyContent: 'start',
                          position: 'relative',
                          overflow: 'visible',
                          // border: '1px solid',
                          borderRadius: 1,
                          // borderColor: 'sky.lighter',
                          bgcolor: noti.is_read ? undefined : 'sky.lightest',
                          padding: '12px',
                        }}>
                        <Stack
                          width="100%"
                          direction="row"
                          justifyContent="space-between"
                          gap="12px">
                          <Stack
                            direction="row"
                            sx={{
                              gap: '8px',
                              flexGrow: 1,
                            }}>
                            <Avatar
                              src={noti.activity.user.avatar_url}
                              sx={{ width: '40px', height: '40px' }}
                            />
                            <Typography
                              variant="body2"
                              color="ink.main"
                              fontWeight={400}>
                              {noti.content}
                            </Typography>
                          </Stack>
                          <Stack gap="8px">
                            <Typography
                              variant="body2"
                              color="ink.lighter"
                              fontWeight={600}
                              fontStyle="italic">
                              {timeAgo(noti.activity.created_date)}
                            </Typography>
                          </Stack>
                        </Stack>
                        {!noti.is_read && (
                          <Stack
                            width="8px"
                            height="8px"
                            sx={{
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                              position: 'absolute',
                              top: 0,
                              right: 0,
                            }}></Stack>
                        )}
                      </Button>
                    );
                  })}
                </Stack>

                <Pagination
                  count={totalPage}
                  page={page}
                  color="primary"
                  onChange={(_, page) => setPage(page)}
                />
              </Stack>
            </Grid>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default NotificationListPage;
