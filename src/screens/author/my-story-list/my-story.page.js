import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import {
  Comment,
  EditNote,
  Favorite,
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
import { blue } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import { useQuery } from 'react-query';

import ConfirmDialog from '@/components/dialog/reuse-confirm-dialog';
import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';
import { countDiffenceFromNow, formatStatistic } from '@/utils/formatters';
import { toastSuccess } from '@/utils/notification';


const MyStoryPage = () => {
  const router = useRouter();
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
    { refetchOnWindowFocus: false }
  );

  const [query, setQuery] = useState('');

  useEffect(() => {
    setMyStories(storiesData ?? []);

  }, [storiesData]);

  const handleDelete = async ({ id }, title) => {
    console.log('handle delete');
    try {
      await new StoryService(requestHeader).delete(id).then((res) => {
        console.log(res)
        toastSuccess('Xóa thành công truyện');
        refetch();
      });
    } catch (error) {
      console.log(error);
      toastSuccess('Xóa không thành công truyện');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await new StoryService(requestHeader).unpublish(id).then((res) => {
        console.log(res)
        toastSuccess('Gỡ đăng thành công truyện');
        refetch();
      });
    } catch (error) {
      console.log(error);
      toastSuccess('Gỡ đăng tải không thành công truyện');
    }
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
          <Stack direction="row" justifyContent="flex-start" columnGap="0.2em" alignItems="center">
            <SvgIcon
              sx={{
                width: '14px',
                color: 'primary.secondary',
                strokeWidth: 3,
              }}>
              {icon ?? <MenuBook></MenuBook>}
            </SvgIcon>
            <Typography component="div" variant="body2">
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
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography onClick={() => { router.push(`my-works/${story.id}`) }} component="div" variant="h6" sx={{ textOverflow: "ellipsis", overflow: "hidden" }} noWrap>
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
                      {story.is_draft === false && story.is_paywalled === false ? <Button variant="text" color="primary" onClick={() => handleUnpublish(story.id)}> Gỡ đăng tải </Button> : <></>}
                      {story.is_paywalled ? <></> : <Button variant="text" color='secondary' onClick={handleDialogOpen}>
                        Xóa truyện
                      </Button>}
                      <ConfirmDialog
                        width={"30%"}
                        title={`Xác nhận xóa truyện ${story.title}`}
                        actionBgColor='secondary'
                        isReverse={true}
                        content={<Grid container direction="column" >
                          <Typography>Tất cả <strong>lượt đoc</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                          <Typography>Tất cả <strong>bình luận</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                          <Typography>Tất cả <strong>bình luận</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                        </Grid>}
                        isOpen={isOpen}
                        handleClose={(isConfirm) => handleDialogClose(isConfirm, story.id)}
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
                  icon={<EyeIcon color={blue[300]} strokeWidth={3}></EyeIcon>}
                  content={`${formatStatistic(story.read_count ?? 0)} lượt đọc`}
                />
                <DetailInfo
                  icon={<Menu strokeWidth={3}></Menu>}
                  content={`${story.published_count ?? 0} chương`}
                />
                <DetailInfo
                  icon={<Comment color='primary' strokeWidth={3}></Comment>}
                  content={`${formatStatistic(
                    story.comment_count ?? 0,
                  )} bình luận`}
                />
                <DetailInfo
                  icon={<EditNote fontSize='large' strokeWidth={3}></EditNote>}
                  content={`${story.draft_count ?? 0} bản thảo`}
                />
                <DetailInfo
                  icon={<Favorite color='secondary' strokeWidth={3}></Favorite>}
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
                  variant="subtitle2"
                  color="sky.base"
                  sx={{ fontStyle: "italic" }}
                >
                  {countDiffenceFromNow(story?.updated_date ?? '_')}
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
        </Card >
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
                <Stack sx={{ marginY: 1, fontStyle: "italic", }}>
                  <Typography variant="h4">Sáng tác của tôi</Typography>
                </Stack>
              </Stack>

              <Grid >
                <Grid width={"70vw"} container direction="row" alignItems="center" rowGap={1}>
                  <Grid item xs={10}>
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
                      sx={{
                        paddingRight: 1,
                        height: "3em",
                        marginY: 2

                      }}
                    />
                  </Grid>
                  <Grid xs={2} direction="row" >
                    <Button fullWidth style={{
                      backgroundColor: (theme) => theme.palette.ink.main,
                      fontSize: "1em",
                      height: "3em"

                    }} size="medium" variant='contained' onClick={() => {
                      router.push('/my-works/create');

                    }
                    }>
                      Thêm truyện
                    </Button>
                  </Grid>
                </Grid>

                <Grid container rowGap={4} sx={{ paddingY: 1 }}>
                  {myStories.length === 0 && isSuccess ? <Grid container spacing={0}>
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
