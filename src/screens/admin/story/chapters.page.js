import Head from 'next/head';

import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';

import StoryChapterTable from './story-chapter-table';

const StoryChapterPage = ({ storyId }) => {
  const requestHeader = useRequestHeader();
  const { data: story = {}, isLoading } = useQuery(
    ['stories', storyId],
    async () => await new StoryService(requestHeader).getById(storyId),
  );

  if (isLoading) return <CircularProgress />;
  return (
    <>
      <Head>
        <title>Danh sách chương {story?.title} </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
              alignItems="flex-end"
              px="16px">
              <Stack spacing={1}>
                <Typography variant="h4">Danh sách chương</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={story?.title} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content"></Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={12}>
                <StoryChapterTable story={story} />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default StoryChapterPage;
