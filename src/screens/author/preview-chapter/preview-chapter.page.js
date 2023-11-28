import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import {
  CheckCircle,
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Popover,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { useQuery } from 'react-query';

import AuthorBreadCrumbs from '@/components/author-bread-crumbs';
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
    { refetchOnWindowFocus: false },
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
    { refetchOnWindowFocus: false },
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
  const [currentChapter, setCurrentChapter] = useState({});
  useEffect(() => {
    setValue(JSON.parse(chapterVersionData?.rich_text === '' ?? '{}'));
    setChapterId(chapterVersionData.chapter_id);
    setCurrentChapter(chapterData);
    var cfg = {};
    var converter = new QuillDeltaToHtmlConverter(value, cfg);

    setHtml(converter.convert());
  }, [chapterVersionData, isSucces, chapterData, router.isReady]);



  const handleRevertChapterVersion = async () => {

    await new ChapterVersionService()
      .revert({ chapterVersionId: router.query['chapter-version-id'] })
      .then((res) => {

        if (res.code === 200) {
          toastSuccess('Khôi phục thành công');
          router.push(`/my-works/${storyId}/write/${chapterId}`);
        } else {
          console.log(res);
          toastError(res.message);
        }
      });
  };

  const navigateToWrite = (e) => {
    // e.preventDefault();
    // router.push(`/my-works/${router.query.id}/write/${chapterId}`);
    router.back();
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
                    // console.log(`/story/${storyId}/${chapterId}`);
                    console.log(currentChapter?.current_version_id);
                    // router.push(`/my-works/${storyData?.id}/preview/${currentChapter?.current_version_id}`);
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
            onClick={navigateToWrite}
            sx={{ margin: '0.5em 0', width: 1 / 3 }}>
            Quay trở lại viết
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => {
              // e.preventDefault();
              handleRevertChapterVersion()
            }}
            sx={{ margin: '1em 0', width: 1 / 3 }}>
            Khôi phục
          </Button>
        </Grid>

        <Stack width={"100%"} direction="column" container alignItems="center">

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
        </Stack>
      </Grid>
    </>
  );
};

export default PreviewChapterPage;
