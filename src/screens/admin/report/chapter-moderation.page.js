import { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import { SHARED_PAGE_SX } from '@/constants/page_sx';

import AppBreadCrumbs from '../../../components/app-bread-crumbs';
import { useRequestHeader } from '../../../hooks/use-request-header';
import ChapterVersionService from '../../../services/chapter-version';
import { formatNumberToFixed } from '../../../utils/formatters';
import LoadingPage from '../../loading';

const MODERATION_MAP = {
  Profanity: 'Thô tục',
  Sexual: 'Khiêu dâm',
  Politics: 'Chính trị',
  Violent: 'Bạo lực',
};

const ChapterModerationPage = ({ chapterVersionId }) => {
  const requestHeader = useRequestHeader();
  // for comment dialog
  const [currentModeration, setCurrentModeration] = useState(null);
  const { data: paras = [], isLoading } = useQuery(
    ['chapters', chapterVersionId, 'moderations'],
    async () =>
      await new ChapterVersionService(requestHeader).getModerationId(
        chapterVersionId,
      ),
    { refetchOnWindowFocus: false },
  );

  //   const { data: para = [], isLoading } = useQuery(
  //     ['chapters', chapterVersionId, 'moderation'],
  //     async () =>
  //       await new ChapterService(requestHeader).getModerationId(
  //         chapterVersionId,
  //       ),
  //     { refetchOnWindowFocus: false },
  //   );

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Chi tiết vi phạm </title>
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
                <Typography variant="h4">Nội dung vi phạm</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content"></Stack>
            </Stack>
            <Grid
              container
              spacing={2}
              sx={{ justifyContent: 'center', display: 'flex' }}>
              <Grid xs={12} lg={8}>
                <Stack gap="16px">
                  <Typography variant="body2" textAlign="center">
                    (Đoạn vi phạm có màu đỏ. Nhấn vào từng đoạn để xem báo cáo
                    chi tiết)
                  </Typography>
                  {paras.map((p, index) => {
                    return p.content_moderation.map((moderation) => {
                      const isMatured = moderation.is_mature;
                      const isReactionary = moderation.is_reactionary;
                      return moderation.type === 'IMAGE' && moderation.image ? (
                        <Box
                          sx={{
                            width: '50%',
                            padding: '8px',
                            bgcolor:
                              isMatured || isReactionary ? 'error.alpha20' : '',
                            borderRadius: '8px',
                          }}>
                          <Typography
                            variant="body2"
                            textAlign="center"
                            color="error">
                            Ảnh có nội dung trưởng thành
                          </Typography>
                          <Box
                            width="100%"
                            component="img"
                            sx={{ filter: 'blur(8px)' }}
                            src={moderation.image}></Box>
                        </Box>
                      ) : (
                        <Button
                          key={moderation.id}
                          variant="text"
                          onClick={() => setCurrentModeration(moderation)}
                          sx={{
                            cursor: 'pointer',
                            textAlign: 'left',
                            justifyContent: 'start',
                            position: 'relative',
                            ':hover': {
                              bgcolor:
                                isMatured || isReactionary
                                  ? 'error.alpha30'
                                  : '',
                            },
                            ':active': {
                              bgcolor:
                                isMatured || isReactionary
                                  ? 'error.alpha50'
                                  : '',
                            },
                            bgcolor:
                              isMatured || isReactionary ? 'error.alpha20' : '',
                          }}>
                          <Typography variant="reading1" color="ink.main">
                            {p.content}
                          </Typography>
                        </Button>
                      );
                    });
                  })}
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
        {currentModeration && (
          <Dialog
            open={Boolean(currentModeration)}
            onClose={() => setCurrentModeration(null)}
            PaperProps={{
              sx: {
                width: '500px',
                maxHeight: '90%',
                borderRadius: 3,
              },
            }}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Chi tiết kiểm duyệt</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setCurrentModeration(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}>
              <Close />
            </IconButton>
            <DialogContent dividers>
              <Stack gap="8px">
                <Stack
                  width="100%"
                  justifyContent="space-between"
                  direction="row">
                  <Typography variant="body1">
                    Nội dung trưởng thành:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={
                      currentModeration.is_mature
                        ? 'error.main'
                        : 'success.main'
                    }>
                    {currentModeration.is_mature ? 'Có' : 'Không'}
                  </Typography>
                </Stack>
                <Stack
                  width="100%"
                  justifyContent="space-between"
                  direction="row">
                  <Typography variant="body1">Nội dung chính trị:</Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={
                      currentModeration.is_reactionary
                        ? 'error.main'
                        : 'success.main'
                    }>
                    {currentModeration.is_reactionary ? 'Có' : 'Không'}
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight={600}>
                  Báo cáo:
                </Typography>
                <Stack
                  padding="8px 16px"
                  sx={{
                    bgcolor: 'ink.alpha10',
                    borderRadius: '8px',
                    gap: '8px',
                  }}>
                  {currentModeration.result.map((item, index) => (
                    <Stack
                      key={index}
                      width="100%"
                      justifyContent="space-between"
                      direction="row">
                      <Typography variant="body2">
                        {MODERATION_MAP[item.criteria_id]}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatNumberToFixed(item.confidence, 4)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default ChapterModerationPage;
