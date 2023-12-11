import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';

import { ArrowBack, CheckCircle, RefreshRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  Popover,
  Skeleton,
  Stack,
  SvgIcon,
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

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default),
  {
    ssr: false,
  },
);

const PreviewChapterPage = ({ chapterVersionId, isPreview }) => {
  const router = useRouter();
  const storyId = router.query.id;
  const requestHeader = useRequestHeader();

  const [value, setValue] = useState('');
  const [html, setHtml] = useState('<p></p>');

  const {
    data: chapterVersionData = {},
    isLoading,
    isSucces,
  } = useQuery(
    ['chapterVersion', chapterVersionId],
    async () =>
      await new ChapterVersionService(requestHeader).getById(chapterVersionId),
    { refetchOnWindowFocus: false },
  );

  const { data: chapterData = [], isLoading: isLoading2 } = useQuery(
    ['chapter', chapterVersionData.chapter_id],
    async () =>
      await new ChapterService(requestHeader).getById(
        chapterVersionData?.chapter_id,
      ),
    { enabled: !!chapterVersionData.chapter_id, refetchOnWindowFocus: false },
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
    var cfg = {};
    var converter = new QuillDeltaToHtmlConverter(value, cfg);

    setHtml(converter.convert());
  }, [chapterVersionData, isSucces, chapterData, router.isReady, value]);

  const handleRevertChapterVersion = async () => {
    await new ChapterVersionService(requestHeader)
      .revert({ chapterVersionId })
      .then((res) => {
        if (res.code === 200) {
          toastSuccess('Khôi phục thành công');
          router.push(
            `/my-works/${storyId}/write/${chapterVersionData.chapter_id}`,
          );
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
      <Stack width={'100%'} direction="column" alignItems="center" gap="24px">
        <Grid xs={12} md={8} lg={6} container>
          <Stack gap="24px">
            {isLoading2 ? (
              <></>
            ) : (
              <AuthorBreadCrumbs
                storyGenerator={true}
                chapterTitle={` ${chapterData?.title ?? 'Tiêu đề chương'}`}
                handleOpen={handleClick}
              />
            )}

            <Stack
              width="100%"
              justifyContent="center"
              alignItems="center"
              gap="16px">
              {!isPreview && (
                <Stack direction="row" justifyContent="space-around" gap="12px">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={
                      <SvgIcon>
                        <ArrowBack></ArrowBack>
                      </SvgIcon>
                    }
                    onClick={navigateToWrite}>
                    Quay trở lại viết
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={
                      <SvgIcon>
                        <RefreshRounded></RefreshRounded>
                      </SvgIcon>
                    }
                    onClick={() => {
                      // e.preventDefault();
                      handleRevertChapterVersion();
                    }}>
                    Khôi phục
                  </Button>
                </Stack>
              )}
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <Box
                  component={'img'}
                  alt="Banner"
                  src={
                    chapterVersionData?.banner_url === ''
                      ? 'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png'
                      : chapterVersionData?.banner_url ?? ''
                  }
                  width="100%"
                  height="250px"
                  sx={{ objectFit: 'cover', borderRadius: '8px' }}
                  // loading="lazy"
                />
              )}
              {isLoading2 ? (
                <Skeleton />
              ) : (
                <Stack justifyContent="center" alignItems="center">
                  <Typography variant="h6" lineHeight="20px" color="initial">
                    {`Chương ${chapterData?.position ?? 1}`}
                    <Typography variant="overline" color="initial">
                      ({chapterData?.is_draft ? 'Bản thảo' : 'Đă đăng tải'})
                    </Typography>
                  </Typography>
                  <Typography variant="h6" lineHeight="20px" color="initial">
                    {isLoading2 ? (
                      <Skeleton />
                    ) : (
                      chapterData?.title ?? 'Tiêu đề'
                    )}{' '}
                  </Typography>{' '}
                </Stack>
              )}
            </Stack>
            <Box
              sx={{
                '.ql-container': {
                  fontSize: '18px',
                },
              }}>
              <ReactQuill
                readOnly
                theme="bubble"
                value={JSON.parse(
                  !chapterVersionData?.rich_text
                    ? '{}'
                    : chapterVersionData?.rich_text,
                )}
              />
            </Box>
          </Stack>
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
                  <Grid container spacing={0} direction="row" columnGap="0.2em">
                    <Typography
                      color={chapter?.is_draft ? 'ink.lighter' : 'primary'}
                      variant="body1">
                      ({chapter?.is_draft ? 'Bản thảo' : 'Đã đăng tải'}){' '}
                    </Typography>
                    <Typography variant="body1" color="sky.dark">{`${
                      formatDate(
                        chapter?.updated_date ?? chapter?.created_date,
                      ).split(' ')[0]
                    }`}</Typography>
                  </Grid>
                </Grid>
                <Grid xs={2} container justifyContent="end" alignItems="center">
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
    </>
  );
};

export default PreviewChapterPage;
