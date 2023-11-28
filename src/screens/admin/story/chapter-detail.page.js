import { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  ChatBubbleOutlineOutlined,
  ChatBubbleRounded,
  FavoriteBorderOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import ChapterService from '@/services/chapter';
import StoryService from '@/services/story';

import LoadingPage from '../../loading';
import ParaCommentDialog from './comment-dialog';

const ChapterDetailPage = ({ chapterId, storyId }) => {
  // const requestHeader = useRequestHeader();
  const router = useRouter();
  // for comment dialog
  const [currentParaId, setCurrentParaId] = useState(null);
  const { data: chapter = {}, isLoading } = useQuery(
    ['chapter', chapterId],
    async () => await new ChapterService(requestHeader).getById(chapterId),
    { refetchOnWindowFocus: false },
  );
  const { data: story = {}, isLoading: storyLoading } = useQuery(
    ['stories', storyId],
    async () => await new StoryService().getById(storyId),
  );

  if (isLoading || storyLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Chi tiết chương </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack gap={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              alignItems="flex-end"
              px="16px">
              <Stack spacing={1}>
                <Typography variant="h4">Chi tiết chương</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={story?.title} name2={chapter?.title} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content"></Stack>
            </Stack>
            <Grid
              container
              spacing={2}
              sx={{ justifyContent: 'center', display: 'flex' }}>
              <Grid xs={12} lg={8}>
                <Stack gap="24px">
                  <Stack gap="12px" justifyContent="center" alignItems="center">
                    <Typography variant="reading1" fontSize="24px">
                      {chapter.title}
                    </Typography>
                    <Stack direction="row" gap="16px">
                      <Stack direction="row" alignItems="center" gap="4px">
                        <SvgIcon sx={{ width: '18px', color: 'primary.main' }}>
                          <VisibilityOutlined></VisibilityOutlined>
                        </SvgIcon>
                        <Typography variant="subtitle2">
                          {chapter?.read_count}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap="4px">
                        <SvgIcon sx={{ width: '18px', color: 'primary.main' }}>
                          <FavoriteBorderOutlined></FavoriteBorderOutlined>
                        </SvgIcon>
                        <Typography variant="subtitle2">
                          {chapter?.vote_count}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap="4px">
                        <SvgIcon sx={{ width: '18px', color: 'primary.main' }}>
                          <ChatBubbleOutlineOutlined></ChatBubbleOutlineOutlined>
                        </SvgIcon>
                        <Typography variant="subtitle2">
                          {chapter?.comment_count}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" gap="12px">
                      <Chip
                        label={
                          chapter.is_paywalled
                            ? 'Chương trả phí'
                            : 'Chương miễn phí'
                        }
                        sx={{
                          backgroundColor: chapter.is_paywalled
                            ? 'error.alpha20'
                            : 'success.alpha20',
                        }}
                      />
                      <Chip
                        label={chapter.is_draft ? 'Đang viết' : 'Đã xuất bản'}
                        sx={{
                          backgroundColor: chapter.is_draft
                            ? 'error.alpha20'
                            : 'success.alpha20',
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{
                      cursor: 'pointer',
                      alignItems: 'center',
                      gap: '8px',
                      fontStyle: 'italic',
                      justifyContent: 'center',
                    }}
                    onClick={() =>
                      router.push(`/admin/users/${story.author.id}`)
                    }>
                    <Avatar
                      sx={{ width: '40px', height: '40px' }}
                      src={story.author.avatar_url}></Avatar>
                    <Typography variant="subtitle1">
                      {story.author.full_name}
                    </Typography>
                  </Stack>
                  <Stack gap="16px">
                    {chapter.paragraphs.map((p, index) => {
                      return (
                        <Stack
                          key={index}
                          sx={{
                            position: 'relative',
                            ':hover': {
                              '> .comment-bubble': {
                                opacity: 1,
                              },
                            },
                          }}>
                          <Typography variant="reading1">
                            {p.content}
                          </Typography>
                          <Button
                            variant="text"
                            className="comment-bubble"
                            onClick={() => setCurrentParaId(p.id)}
                            sx={{
                              opacity: 0,
                              position: 'absolute',
                              right: 0,
                              bottom: 0,
                              cursor: 'pointer',
                              color: 'primary.main',
                              borderRadius: 20,
                              padding: '8px',
                              minWidth: 0,
                              ':hover': {
                                color: 'primary.alpha70',
                              },
                            }}>
                            <SvgIcon sx={{ width: '20px', height: '20px' }}>
                              <ChatBubbleRounded></ChatBubbleRounded>
                            </SvgIcon>
                          </Button>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>

        {/* COMMENT DIALOG */}
        <ParaCommentDialog
          paraId={currentParaId}
          open={Boolean(currentParaId)}
          onClose={() => setCurrentParaId(null)}
        />
      </Box>
    </>
  );
};

export default ChapterDetailPage;
