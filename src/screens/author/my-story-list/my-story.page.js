import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import {
  CleaningServices,
  Comment,
  FavoriteBorder,
  Menu,
  MenuBook,
  MoreVert,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Popover,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import { useQuery } from 'react-query';

import ConfirmDialog from '@/components/dialog/reuse-confirm-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';
import { countDiffenceFromNow, formatStatistic } from '@/utils/formatters';
import { toastSuccess } from '@/utils/notification';

const MyStoryPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const requestHeader = useRequestHeader();

  const [myStories, setMyStories] = useState([]);
  const {
    data: storiesData = [],
    isLoading,
    isSuccess,
    refetch,
    isError,
  } = useQuery(
    ['myStories'],
    async () => await new StoryService(requestHeader).getMyStories(),
  );

  const [query, setQuery] = useState('');

  useEffect(() => {
    setMyStories(storiesData ?? []);

  }, [storiesData]);

  const handleDelete = async ({ id }, title) => {
    try {
      await StoryService.delete(id).then((res) => {
        toastSuccess('Xóa thành công truyện');
        refetch();
      });
    } catch (error) { }
  };
  const StoryOverViewCard = ({ story }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
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
    // const theme = useTheme();
    const DetailInfo = ({ icon, content, isHighlight = false }) => {
      return (
        <>
          <Stack direction="row" justifyContent="flex-start" columnGap="0.2em">
            <SvgIcon
              sx={{
                width: '14px',
                color: 'primary.secondary',
                strokeWidth: 3,
              }}>
              {icon ?? <MenuBook></MenuBook>}
            </SvgIcon>
            <Typography component="div" variant="body1">
              {content ?? 'Mặc định'}
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
            minWidth: "20em",
            justifyContent: 'center',
            alignItems: 'center',
            height: '14em',
          }}>
          <CircularProgress />
        </Card>
      );
    return (
      <>
        <Card sx={{ display: 'flex', width: "100%", height: "14em", }}>
          <CardMedia
            onClick={() => { router.push(`my-works/${story.id}`) }}
            component="img"
            sx={{ width: "10em", height: "14em", objectFit: "cover" }}
            src={story.cover_url !== '' ? story.cover_url : "https://imgv3.fotor.com/images/gallery/Fiction-Book-Covers.jpg"}
            alt="Live from space album cover"
          />
          <CardContent sx={{ boxSizing: "border-box", display: 'flex', flexDirection: 'column', width: "67%", alignItems: "stretch", height: "14em" }}>
            <Stack direction="column" justifyContent="center" >
              <Stack direction="row" justifyContent="space-between">
                <Typography onClick={() => { router.push(`my-works/${story.id}`) }} component="div" variant="h6">
                  {story.title}
                </Typography>
                <Box>
                  <IconButton color='inherit' aria-describedby={id} variant="text" onClick={handleClick}>
                    <MoreVert />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Grid container direction="column">
                      {story.is_draft === false && story.is_paywalled === false ? <Button variant="text" color="primary"> Gỡ đăng tải </Button> : <></>}
                      {story.is_paywalled ? <></> : <Button variant="text" color='secondary' onClick={handleDialogOpen}>
                        Xóa truyện
                      </Button>}
                      <ConfirmDialog
                        title={`Xác nhận xóa truyện ${story.title}`}
                        actionBgColor='secondary'
                        isReverse={true}
                        content={<Grid container direction="column" >
                          <Typography>Tất cả <strong>lượt đoc</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                          <Typography>Tất cả <strong>bình luận</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                          <Typography>Tất cả <strong>bình luận</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                        </Grid>}
                        isOpen={isOpen}
                        handleClose={() => { handleDialogClose(true, story.id) }}
                        actionContent='Xác nhận xóa'
                        cancelContent='Hủy thao tác'
                      />
                    </Grid>
                  </Popover>
                </Box>

              </Stack>

              <Typography component="div" variant="subtitle1" color="sky.dark">
                (
                {story.is_draft === false
                  ? story.is_paywalled
                    ? 'Đã đăng tải, truyện trả phí'
                    : 'Đã đăng tải'
                  : 'Bản nháp'}
                )
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}>
                <DetailInfo
                  icon={<EyeIcon strokeWidth={3}></EyeIcon>}
                  content={`${formatStatistic(story.read_count ?? 0)} lượt đọc`}
                />
                <DetailInfo
                  icon={<Menu strokeWidth={3}></Menu>}
                  content={`${story.published_count ?? 0} chương`}
                />
                <DetailInfo
                  icon={<Comment strokeWidth={3}></Comment>}
                  content={`${formatStatistic(
                    story.comment_count ?? 0,
                  )} bình luận`}
                />
                <DetailInfo
                  icon={<Menu strokeWidth={3}></Menu>}
                  content={`${story.draft_count ?? 0} bản thảo`}
                />
                <DetailInfo
                  icon={<FavoriteBorder strokeWidth={3}></FavoriteBorder>}
                  content={`${formatStatistic(story.vote_count ?? 0)} lượt`}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  alignContent: 'end',
                }}>
                <Typography
                  component="div"
                  variant="subtitle1"
                  color="sky.base">
                  Cập nhật vào {countDiffenceFromNow(story.updated_date)}
                </Typography>
                <Button
                  sx={{
                    borderRadius: 35,
                    backgroundColor: (theme) => theme.palette.ink.main,
                    padding: '0.5em 2em',
                  }}
                  size="medium"
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
      <div style={{ width: '100%' }}>
        <Box
          sx={{
            mx: '12em',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Container
            maxWidth="xl"
            sx={{ display: 'flex', justifyContent: 'center', marginY: 4 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="center">
                <Stack sx={{ marginY: '2em' }}>
                  <Typography variant="h3">Sáng tác của tôi</Typography>
                </Stack>
              </Stack>

              <Grid spacing={4}>
                <Grid width={"70vw"} container direction="row" alignItems="center">
                  <Grid xs={10}>
                    <TextField
                      fullWidth
                      id="outlined-controlled"
                      label="Tìm kiếm"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);

                        setMyStories(e.target.value !== "" ? storiesData.filter((person) =>
                          person?.title.toLowerCase().includes(e.target.value.toLowerCase())
                        ) : storiesData);
                      }}
                      sx={{}}
                    />
                  </Grid>


                  <Grid xs={2} container direction="row" justifyContent="end" columnGap={1}>
                    <Button style={{
                      backgroundColor: (theme) => theme.palette.ink.main,
                      fontSize: "1.2em"

                    }} size="medium" variant='contained' onClick={() => router.push('/my-works/create', { scroll: false })
                    }>
                      Thêm truyện
                    </Button>
                  </Grid>
                </Grid>

                <Grid container rowGap={4} sx={{ paddingY: 1 }}>
                  {myStories.length === 0 ? <Grid container spacing={0}>
                    <Typography>Không tìm thấy truyện nào</Typography>

                  </Grid> : myStories?.map((story, index) => (
                    <Grid
                      item
                      lg={6}
                      xs={12}
                      key={story.id}
                      sx={{
                        paddingRight: index % 2 === 0 ? '1em' : '0em',
                        paddingLeft: index % 2 !== 0 ? '1em' : '0em',
                      }}>
                      <StoryOverViewCard story={story}></StoryOverViewCard>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Stack>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default MyStoryPage;
