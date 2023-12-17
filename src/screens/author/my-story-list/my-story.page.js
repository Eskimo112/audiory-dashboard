import React, { useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import {
  Add,
  Comment,
  DeleteForeverOutlined,
  EditNote,
  Favorite,
  Menu,
  MenuBook,
  MoreVert,
  UnpublishedOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  inputBaseClasses,
  Pagination,
  Popover,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { blue } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import { useQuery } from 'react-query';

import ConfirmDialog from '@/components/dialog/reuse-confirm-dialog';
import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';
import { formatStatistic, timeAgo } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

import useDebounce from '../../../hooks/use-debounce';
import { SHARED_PAGE_SX } from '../../../constants/page_sx';

const STORY_PER_PAGE = 6;

const MyStoryPage = () => {
  const router = useRouter();
  const requestHeader = useRequestHeader();

  const {
    data: storiesData = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery(
    ['myStories'],
    async () => await new StoryService(requestHeader).getMyStories(),
    { refetchOnWindowFocus: false },
  );

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [page, setPage] = useState(1);

  const filteredStories = useMemo(() => {
    return storiesData.filter((story) =>
      story?.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery, storiesData]);

  const stories = useMemo(() => {
    return filteredStories.slice(
      (page - 1) * STORY_PER_PAGE,
      page * STORY_PER_PAGE,
    );
  }, [filteredStories, page]);

  const handleDelete = async ({ id }, title) => {
    try {
      await new StoryService(requestHeader).delete(id).then((res) => {
        console.log(res);
        toastSuccess('Xóa thành công truyện');
        refetch();
      });
    } catch (error) {
      console.log(error);
      toastSuccess('Xóa không thành công truyện');
    }
  };

  const handleUnpublish = async ({ id }) => {
    console.log(id);
    try {
      await new StoryService(requestHeader).unpublish(id).then((res) => {
        console.log(res);
        toastSuccess('Gỡ đăng thành công truyện');
        refetch();
      });
    } catch (error) {
      console.log(error);
      toastError('Gỡ đăng tải không thành công truyện');
    }
  };
  const StoryOverViewCard = ({ story }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [isOpen, setIsOpen] = React.useState(false);
    const handleDialogOpen = () => {
      setIsOpen(true);
    };

    const handleDialogClose = (isConfirm, id) => {
      setIsOpen(false);
      if (isConfirm === true) {
        handleDelete({ id });
      }
    };

    const handleNavigate = () => {
      router.push(`my-works/${story.id}`);
    };
    // const theme = useTheme();
    const DetailInfo = ({ icon, number, content, isHighlight = false }) => {
      return (
        <>
          <Stack
            direction="row"
            justifyContent="flex-start"
            columnGap="0.2em"
            alignItems="center">
            <SvgIcon
              sx={{
                width: '14px',
                color: 'primary.secondary',
                strokeWidth: 3,
              }}>
              {icon ?? <MenuBook></MenuBook>}
            </SvgIcon>
            <Typography component="div" variant="body2" fontSize="15px">
              <b>{number}</b> <i>{content ?? 'Mặc định'}</i>
            </Typography>
          </Stack>
        </>
      );
    };

    if (isLoading)
      return (
        <Card
          sx={{
            display: 'flex',
            width: '100%',
            minWidth: '20em',
            justifyContent: 'center',
            alignItems: 'center',
            height: '12em',
          }}>
          <CircularProgress />
        </Card>
      );
    return (
      <>
        <Card
          elevation={2}
          sx={{
            display: 'flex',
            width: '100%',
            height: '12em',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            // e.preventDefault();
            handleNavigate();
          }}>
          <CardMedia
            component="img"
            sx={{ width: '8em', objectFit: 'cover' }}
            src={
              story.cover_url !== ''
                ? story.cover_url
                : 'https://imgv3.fotor.com/images/gallery/Fiction-Book-Covers.jpg'
            }
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleNavigate();
            }}
            alt="Live from space album cover"
          />
          <CardContent
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              px: '16px',
              py: '16px',
            }}>
            <Stack
              direction="column"
              justiPyContent="space-between"
              gap="6px"
              height="100%">
              <Stack gap="4px">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Typography
                    component="div"
                    variant="h6"
                    sx={{
                      whiteSpace: 'wrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      fontSize: '19px',
                      lineHeight: '24px',
                    }}>
                    {story.title}
                  </Typography>
                  <Box>
                    <IconButton
                      color="inherit"
                      aria-describedby={id}
                      variant="text"
                      sx={{ padding: '4px', color: 'ink.lighter' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClick(e);
                      }}>
                      <MoreVert />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={(e) => handleClose(e)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}>
                      <Grid container direction="column">
                        {story.is_draft === false &&
                        story.is_paywalled === false ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              handleUnpublish({ id: story.id });
                            }}
                            startIcon={
                              <SvgIcon sx={{ width: '18px' }}>
                                <UnpublishedOutlined></UnpublishedOutlined>
                              </SvgIcon>
                            }
                            variant="text"
                            color="primary">
                            Gỡ đăng tải{' '}
                          </Button>
                        ) : (
                          <></>
                        )}
                        {story.is_paywalled ? (
                          <></>
                        ) : (
                          <Button
                            variant="text"
                            color="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDialogOpen();
                            }}
                            startIcon={
                              <SvgIcon sx={{ width: '18px' }}>
                                <DeleteForeverOutlined></DeleteForeverOutlined>
                              </SvgIcon>
                            }>
                            Xóa truyện
                          </Button>
                        )}
                        <ConfirmDialog
                          width={'30%'}
                          title={`Xác nhận xóa truyện ${story.title}`}
                          actionBgColor="secondary"
                          isReverse={true}
                          content={
                            <Grid container direction="column">
                              <Typography>
                                Tất cả <strong>lượt đoc</strong> , nội dung sẽ
                                bị <strong>xóa</strong>
                              </Typography>
                              <Typography>
                                Tất cả <strong>bình luận</strong> , nội dung sẽ
                                bị <strong>xóa</strong>
                              </Typography>
                              <Typography>
                                Tất cả <strong>bình luận</strong> , nội dung sẽ
                                bị <strong>xóa</strong>
                              </Typography>
                            </Grid>
                          }
                          isOpen={isOpen}
                          handleClose={(isConfirm) =>
                            handleDialogClose(isConfirm, story.id)
                          }
                          actionContent="Xác nhận xóa"
                          cancelContent="Hủy thao tác"
                        />
                      </Grid>
                    </Popover>
                  </Box>
                </Stack>

                <Typography
                  component="div"
                  fontStyle="italic"
                  variant="subtitle1"
                  lineHeight="16px"
                  color={
                    story.is_draft === false ? 'primary.main' : 'secondary.main'
                  }>
                  (
                  {story.is_draft === false
                    ? story.is_paywalled
                      ? 'Đã đăng tải, truyện trả phí'
                      : 'Đã đăng tải'
                    : 'Bản nháp'}
                  )
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}>
                <DetailInfo
                  icon={<EyeIcon color={blue[300]} strokeWidth={3}></EyeIcon>}
                  content={`lượt đọc`}
                  number={formatStatistic(story.read_count ?? 0)}
                />
                <DetailInfo
                  icon={<Menu strokeWidth={3}></Menu>}
                  number={formatStatistic(story.published_count ?? 0)}
                  content={`chương`}
                />
                <DetailInfo
                  icon={<Comment color="primary" strokeWidth={3}></Comment>}
                  number={formatStatistic(story.comment_count ?? 0)}
                  content={` bình luận`}
                />
                <DetailInfo
                  icon={<EditNote fontSize="large" strokeWidth={3}></EditNote>}
                  number={formatStatistic(story.draft_count ?? 0)}
                  content={` bản thảo`}
                />
                <DetailInfo
                  icon={<Favorite color="secondary" strokeWidth={3}></Favorite>}
                  number={formatStatistic(story.vote_count ?? 0)}
                  content={` lượt`}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Typography
                  component="div"
                  variant="body2"
                  color="sky.base"
                  sx={{ fontStyle: 'italic' }}>
                  Cập nhật vào {timeAgo(story?.updated_date ?? '_')}
                </Typography>
                <Button
                  sx={{
                    borderRadius: 35,
                    backgroundColor: (theme) => theme.palette.ink.main,
                    padding: '6px 16px',
                    whiteSpace: 'nowrap',
                  }}
                  variant="contained"
                  onClick={() => {
                    router.push(`my-works/${story.id}`);
                  }}>
                  Viết tiếp
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Trang viết | Audiory</title>
      </Head>
      <Box
        component="main"
        sx={{
          ...SHARED_PAGE_SX,
          // background: '#93DBD8',
          // background: 'radial-gradient(at center, #DEF6FA, #FFFFFF)',
        }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Container
            maxWidth="xl"
            sx={{
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
              marginY: 4,
            }}>
            <Stack
              spacing={1}
              width="100%"
              gap="12px"
              justifyContent="center"
              alignItems="center">
              <Stack sx={{ marginY: 1, fontStyle: 'italic' }}>
                <Typography variant="h4">Sáng tác của tôi</Typography>
              </Stack>

              <Stack
                width="100%"
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Stack
                  width="35%"
                  direction="row"
                  gap="16px"
                  justifyContent="center"
                  alignItems="center">
                  <TextField
                    id="outlined-controlled"
                    variant="outlined"
                    placeholder="Nhập để tìm truyện"
                    value={query}
                    sx={{
                      flexGrow: 1,
                      [`& .${inputBaseClasses.root}`]: {
                        borderRadius: '100px',
                        input: {
                          padding: '12px 16px',
                        },
                      },
                    }}
                    // onKeyDown={(event) => {
                    //   const value = event.target.value.trim();
                    //   if (
                    //     (event.keyCode === 32 || event.keyCode === 13) &&
                    //     value !== ''
                    //   ) {
                    //     setQuery(value);
                    //   }
                    // }}
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                  />
                  <Button
                    sx={{
                      fontSize: '14px',
                      borderRadius: '30px',
                      minWidth: 0,
                      display: 'flex',
                    }}
                    variant="contained"
                    color="info"
                    onClick={() => {}}>
                    Tìm kiếm
                  </Button>
                </Stack>
                <Button
                  style={{
                    fontSize: '16px',
                    padding: '8px 16px',
                    flexGrow: 0,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  startIcon={
                    <SvgIcon>
                      <Add />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    router.push('/my-works/create');
                  }}>
                  Thêm truyện
                </Button>
              </Stack>

              <Grid container spacing={3} sx={{ width: '100%' }}>
                {stories.length === 0 && isSuccess ? (
                  <Grid xs={12} spacing={0}>
                    <Typography variant="body1" whiteSpace="nowrap">
                      Không tìm thấy truyện nào
                    </Typography>
                  </Grid>
                ) : (
                  stories?.map((story, index) => (
                    <Grid item lg={6} xs={12} key={story.id}>
                      <StoryOverViewCard story={story}></StoryOverViewCard>
                    </Grid>
                  ))
                )}
              </Grid>

              <Stack alignItems="center" width="100%">
                <Pagination
                  page={page}
                  onChange={(e, page) => setPage(page)}
                  count={Math.ceil(
                    filteredStories.length / STORY_PER_PAGE,
                  )}></Pagination>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default MyStoryPage;
