import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import {
  FastForward,
  FastRewind,
  FavoriteBorderOutlined,
  GifBoxOutlined,
  ListAlt,
  PlayArrow,
  Settings,
  SettingsOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { useQuery } from 'react-query';

import { useAuth } from '@/hooks/use-auth';
import StoryService from '@/services/story';
import { formatDateTime } from '@/utils/formatters';
import ChapterService from '@/services/chapter';

const { useRouter } = require('next/router');

const PreviewStoryPage = () => {
  const router = useRouter();
  const storyId = router.query.id;
  const auth = useAuth();
  const jwt = auth.user.token;

  const {
    data: storyData = {},
    isLoading,
    isSuccess,
  } = useQuery(
    ['story', router.isReady],
    async () => await StoryService.getById({ storyId: router.query.id, jwt }),
  );

  useEffect(() => {}, []);

  const ChapterCard = ({ chapter, index }) => {
    const handleNavigate = async () => {
      await ChapterService.getById({ chapterId: chapter?.id, jwt }).then(
        (res) => {
          console.log(res);
          console.log(res?.current_chapter_version?.id);
          router.push(`/story/${storyId}/${res?.current_chapter_version?.id}`);
        },
      );
    };
    const isDraft = chapter?.is_draft;
    return (
      <Button
        fullWidth
        color={isDraft ? 'inherit' : 'inherit'}
        variant={isDraft ? 'text' : 'outlined'}
        key={index}
        sx={{
          marginTop: '0.5em',
          backgroundColor: !isDraft ? 'primary.lightest' : 'sky.lightest',
        }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap">
          <Grid
            xs={8}
            spacing={0}
            container
            justifyContent="flex-start"
            onClick={handleNavigate}>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="flex-start">
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ paddingRight: '2em' }}>
                Chương {index + 1}: {chapter?.title ?? 'Tiêu đề chương'}{' '}
              </Typography>
              <Typography
                color={isDraft ? 'ink.main' : 'ink.main'}
                variant="subtitle2"
                noWrap
                sx={{ paddingRight: '2em' }}>
                {' '}
                {isDraft ? 'Bản thảo ' : 'Đã đăng tải '}{' '}
                {
                  formatDateTime(
                    chapter.updated_date ?? chapter?.created_date,
                  ).split(' ')[0]
                }{' '}
              </Typography>
            </Grid>
          </Grid>
          {chapter?.price !== 0 ? (
            <Grid
              xs={1}
              container
              justifyContent="flex-start"
              alignItems="center"
              onClick={handleNavigate}>
              {chapter?.price}{' '}
              <CurrencyDollarIcon width="1.5em" color="primary" />
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Button>
    );
  };

  return (
    <>
      <Grid container width={1 / 1} direction="column" alignItems="center">
        {/* banner */}
        <Grid container spacing={0}>
          <Container maxWidth="lg" width="100%">
            <Box
              component="img"
              sx={{
                height: '16em',
                width: '12em',
                objectFit: 'inherit',
              }}
              alt="The house from the offer."
              src={storyData?.cover_url}></Box>
          </Container>
        </Grid>
        <Grid width={2 / 3}>
          {storyData?.title}
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            alignContent="stretch"
            wrap="wrap">
            {storyData &&
              storyData?.chapters?.map((chapter, index) => (
                <Grid container xs={6} key={index} columnGap="1em">
                  <ChapterCard chapter={chapter} index={index} />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PreviewStoryPage;
