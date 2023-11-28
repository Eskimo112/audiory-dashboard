import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  CheckCircle,
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
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Popover,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { useQuery } from 'react-query';

import AuthorBreadCrumbs from '@/components/author-bread-crumbs';
import { useAuth } from '@/hooks/use-auth';
import { useRequestHeader } from '@/hooks/use-request-header';
import ChapterService from '@/services/chapter';
import ChapterVersionService from '@/services/chapter-version';
import { formatDate } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

const { useRouter } = require('next/router');

const PreviewChapterPage = () => {
  const router = useRouter();
  const storyId = router.query.id;
  const requestHeader = useRequestHeader();
  const [chapter, setChapter] = useState({ title: '' });
  const [chapterId, setChapterId] = useState('');

  const [value, setValue] = useState('');
  const [html, setHtml] = useState('<p></p>');

  const ReactQuill =
    typeof window === 'object' ? require('react-quill') : () => false;

  const {
    data: chapterVersionData = [],
    isLoading,
    isSucces,
    refetch,
  } = useQuery(
    ['chapterVersionData', router.isReady],
    async () =>
      await new ChapterVersionService(requestHeader).getById(
        router.query['chapter-version-id'],
      ),
    { refetchOnWindowFocus: false }
  );

  const {
    data: chapterData = [],
    isLoading: isLoading2,
    isRefetching,
  } = useQuery(
    ['chapterData', isSucces],
    async () =>
      await new ChapterService(requestHeader).getById({
        chapterId: chapterVersionData?.chapter_id,
      }),
    { refetchOnWindowFocus: false }

  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event, storyData) => {
    setStoryData(storyData);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [storyData, setStoryData] = useState({});
  useEffect(() => {
    setValue(JSON.parse(chapterVersionData?.rich_text === '' ?? '{}'));
    setChapterId(chapterVersionData.chapter_id);
    var cfg = {};
    var converter = new QuillDeltaToHtmlConverter(value, cfg);

    setHtml(converter.convert());
  }, [chapterVersionData, isSucces, chapterData, router.isReady]);

  const MediaControlCard = () => {
    const theme = useTheme();
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
      height: 8,
      borderRadius: 5,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'sky.light',
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: 'primary.dark',
      },
    }));

    return (
      <Card sx={{ width: '100%', backgroundColor: 'sky.lightest' }}>
        <Grid
          xs={{ width: '100%' }}
          container
          direction="column"
          alignItems="center">
          <Grid
            container
            direction="column"
            alignItems="center"
            alignContent="center"
            xs={12}>
            <CardContent>
              <Typography component="div" variant="h6">
                Nghe audio
              </Typography>
            </CardContent>
          </Grid>

          <Grid container xs={12} direction="column">
            <Grid xs={12}>
              <BorderLinearProgress
                variant="determinate"
                value={35}
                sx={{ margin: '0em 1em' }}
              />
            </Grid>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}>
              <IconButton aria-label="previous">
                {theme.direction === 'rtl' ? <FastForward /> : <FastRewind />}
              </IconButton>
              <IconButton aria-label="play/pause">
                <PlayArrow sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="next">
                {theme.direction === 'rtl' ? <FastRewind /> : <FastForward />}
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    );
  };

  const handleRevertChapterVersion = async (e) => {
    e.preventDefault();

    await new ChapterVersionService()
      .revert({ chapterVersionId: router.query['chapter-version-id'] })
      .then((res) => {
        if (res.code === 200) {
          toastSuccess('Khôi phục thành công');

          router.push(`/my-works/${router.query.id}/write/${chapterId}`);
        } else {
          console.log(res);
          toastError(res.message);
        }
      });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ margin: '1em 0' }}>
        {isRefetching ? (
          <Skeleton />
        ) : (
          <AuthorBreadCrumbs
            storyGenerator={true}
            chapterTitle={` ${chapterData?.title ?? 'Tiêu đề chương'}`}
            handleOpen={handleClick}
          />
        )}

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onBlur={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          sx={{ maxHeight: '25em' }}>
          <Grid container direction="column">
            {storyData &&
              storyData?.chapters?.map((chapter, index) => (
                <Button
                  key={chapter?.id}
                  spacing={0}
                  sx={{
                    minWidth: '30em',
                    maxWidth: '25em',
                    display: 'flex',
                    direction: 'row',
                    border: 'none',
                    borderBottom: '0.5px solid #F1EFEF',
                    padding: '0.6em 1.2em',
                  }}
                  onClick={(e) => {
                    console.log(`/story/${storyId}/${chapterId}`);
                    router.push(`/story/${storyData?.id}/${chapter?.id}`);
                  }}>
                  <Grid xs={10} container spacing={0}>
                    <Grid
                      container
                      spacing={0}
                      direction="row"
                      justifyContent="flex-start">
                      <Typography
                        sx={{ fontWeight: 'bold' }}
                        variant="subtitle1"
                        color="ink.main">
                        Chương {index + 1} -
                      </Typography>
                      <Typography
                        noWrap
                        sx={{
                          fontWeight: 'bold',
                          textAlign: 'start',
                          width: '12em',
                          textOverflow: 'ellipsis',
                        }}
                        variant="subtitle1"
                        color="ink.main">
                        {chapter?.title ?? ' Tiêu đề'}
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      spacing={0}
                      direction="row"
                      columnGap="0.2em">
                      <Typography
                        color={chapter?.is_draft ? 'ink.lighter' : 'primary'}
                        variant="body1">
                        ({chapter?.is_draft ? 'Bản thảo' : 'Đã đăng tải'}){' '}
                      </Typography>
                      <Typography variant="body1" color="sky.dark">{`${formatDate(
                        chapter?.updated_date ?? chapter?.created_date,
                      ).split(' ')[0]
                        }`}</Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    xs={2}
                    container
                    justifyContent="end"
                    alignItems="center">
                    {chapterData && chapterData?.id === chapter.id ? (
                      <CheckCircle color="primary" fontSize="medium" />
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Button>
              ))}
          </Grid>
        </Popover>
        <Grid container>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Card>
              <CardMedia
                alt="Banner"
                image={
                  chapterVersionData?.banner_url === ''
                    ? 'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png'
                    : chapterVersionData?.banner_url ?? ''
                }
                width="20em"
                height="10em"
                loading="lazy"
              />
            </Card>
          )}
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          sx={{ margin: '2em 0' }}>
          <Typography variant="h6" color="initial">
            {isLoading2 ? <Skeleton /> : `Chương ${chapterData?.position ?? 1}`}{' '}
            <Typography variant="overline" color="initial">
              ({chapterData?.is_draft ? 'Bản thảo' : 'Đă đăng tải'})
            </Typography>
          </Typography>
          <Typography variant="h6" color="initial">
            {isLoading2 ? <Skeleton /> : chapterData?.title ?? 'Tiêu đề'}{' '}
          </Typography>
          {/* <Button variant="contained" color="primary" sx={{ margin: "1em 0", width: 1 / 3 }}>
                        Đọc phần tiếp theo
                    </Button> */}
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleRevertChapterVersion}
            sx={{ margin: '1em 0', width: 1 / 3 }}>
            Khôi phục
          </Button>
        </Grid>

        <Grid direction="column" container alignItems="center">
          {/* <Grid xs={2} >
                        <Typography variant="h5" color="initial"></Typography>
                    </Grid> */}
          <Grid xs={6} container>
            {/* {isLoading ? <Skeleton /> : <MediaControlCard />} */}

            {isLoading ? (
              <Skeleton
                sx={{ bgcolor: 'sky.light' }}
                variant="rectangular"
                width="100%"
                height={118}
              />
            ) : (
              <ReactQuill
                readOnly
                theme="bubble"
                value={JSON.parse(
                  chapterVersionData?.rich_text === ''
                    ? '{}'
                    : chapterVersionData?.rich_text,
                )}
              />
            )}

            <Grid xs={6} container alignItems="center" justifyContent="center">
              {/* <Button fullWidth variant="contained" color="primary" sx={{ margin: "1em 0" }}>
                                Đọc phần tiếp theo
                            </Button>
                            <Button fullWidth variant="outlined" color="primary" onClick={handleRevertChapterVersion}>
                                Khôi phục
                            </Button> */}
            </Grid>
          </Grid>
          <Grid
            xs={2}
            spacing={0}
            container
            justifyContent="center"
            direction="column">
            {/* <Container maxWidth="2em">
                            <IconButton aria-label="" size="medium" color="sky" sx={{ backgroundColor: 'ink.base' }}>
                                <SettingsOutlined />
                            </IconButton>
                        </Container>
                        <Container maxWidth="2em">
                            <IconButton aria-label="" size="medium" color="sky" sx={{ backgroundColor: 'ink.base' }}>
                                <FavoriteBorderOutlined />
                            </IconButton>
                        </Container>
                        <Container maxWidth="2em">
                            <IconButton size="medium" color="sky" sx={{ backgroundColor: 'ink.base' }}>
                                <ListAlt />
                            </IconButton>
                        </Container>
                        <Container maxWidth="2em">
                            <IconButton size="medium" color="sky" sx={{ backgroundColor: 'ink.base' }}>
                                <GifBoxOutlined />
                            </IconButton>
                        </Container> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PreviewChapterPage;
