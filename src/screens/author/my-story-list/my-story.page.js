import React, { useEffect, useState } from 'react';

import Head from "next/head";
import { useRouter } from 'next/router';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import { Comment, FavoriteBorder, Menu, MenuBook, MoreVert } from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    MenuItem,
    Popover,
    Stack,
    SvgIcon,
    TextField,
    Typography
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import { useQuery } from 'react-query';

import { useAuth } from '@/hooks/use-auth';
import { usePopover } from '@/hooks/use-popover';
import { MyStoryPopover } from '@/layouts/author/my-story-popover';
import StoryService from '@/services/story';
import { toastSuccess } from '@/utils/notification';


const MyStoryPage = () => {
    const router = useRouter();
    const auth = useAuth();
    const jwt = auth.user.token;
    const [myStories, setMyStories] = useState([]);
    const { data: storiesData = [], isLoading, isSuccess, refetch } = useQuery(
        ['myStories'],
        async () => await StoryService.getMyStories(jwt),
    );
    useEffect(() => {
        setMyStories(storiesData);
    }, [storiesData]);

    const AlertDialog = ({ title }) => {
        const [open, setOpen] = React.useState(false);

        const handleClickOpen = (e) => {
            setOpen(true);
        };

        const handleClose = (isConfirm) => {
            console.log(isConfirm)
            setOpen(false);
        };



        return (
            <React.Fragment>
                <Button variant="text" color='secondary' onClick={(e) => handleClickOpen}>
                    Xóa truyện
                </Button>
                <Dialog

                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Xác nhận xóa  {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Tất xả lượt đọc, bình chọn, bình luận của truyện này sẽ bị xóa vĩnh viễn
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose(true)} autoFocus color='secondary'>Xác nhận xóa</Button>
                        <Button onClick={handleClose} >
                            Hủy thao tác
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
    const handleDelete = async ({ id }) => {
        try {
            await StoryService.delete(id)
            toastSuccess();
            refetch();

        } catch (error) {

        }
    }
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
        console.log(story.cover_url)
        // const theme = useTheme();
        const DetailInfo = ({ icon, content, isHighlight = false }) => {
            return <>
                <Stack direction="row" justifyContent="flex-start">
                    <SvgIcon sx={{ width: '14px', color: 'primary.secondary', strokeWidth: 3 }}>
                        {icon ?? <MenuBook></MenuBook>}
                    </SvgIcon>
                    <Typography component="div" variant="body1" >
                        {content ?? 'Mặc định'}
                    </Typography>
                </Stack>
            </>
        }

        if (isLoading)
            return (
                <Card
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '500px',
                    }}>
                    <CircularProgress />
                </Card>
            );
        return (
            <>
                <Card aria-describedby="alo" sx={{ display: 'flex', width: "100%", height: "20em" }}>
                    <CardMedia
                        onClick={() => { router.push(`my-works/${story.id}`) }}
                        component="img"
                        sx={{ width: "35%", objectFit: "inherit" }}
                        src={story.cover_url !== '' ? story.cover_url : "https://imgv3.fotor.com/images/gallery/Fiction-Book-Covers.jpg"}
                        alt="Live from space album cover"
                    />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', width: "100%", height: "10em" }}>
                        <Stack direction="column"  >
                            <Stack direction="row" justifyContent="flex-end">
                                <Box sx={{}}>
                                    <Button aria-describedby={id} variant="text" onClick={handleClick}>
                                        <MoreVert />
                                    </Button>
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

                                            {story.is_draft ? <Button variant="text" color="primary">Đăng tải</Button> : <></>}

                                            <AlertDialog title={story.title} />


                                        </Grid>

                                    </Popover>
                                </Box>
                            </Stack>

                            <Typography onClick={() => { router.push(`my-works/${story.id}`) }} component="div" variant="h5">
                                {story.title}
                            </Typography>
                            <Typography component="div" variant="body1">
                                ({story.is_draft === false ? 'Đã đăng tải' : "Bản nháp"})
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gap: 1,
                                    gridTemplateColumns: 'repeat(2, 1fr)',

                                }}
                            >
                                <DetailInfo icon={<EyeIcon strokeWidth={3}></EyeIcon>} content={`${story.read_count ?? 0} lượt đọc`} />
                                <DetailInfo icon={<Menu strokeWidth={3}></Menu>} content={`${story.published_count ?? 0} chương`} />
                                <DetailInfo icon={<Comment strokeWidth={3}></Comment>} content={`${story.comment_count ?? 0} bình luận`} />
                                <DetailInfo icon={<Menu strokeWidth={3}></Menu>} content={`${story.draft_count ?? 0} bản thảo`} />
                                <DetailInfo icon={<FavoriteBorder strokeWidth={3}></FavoriteBorder>} content={`${story.vote_count ?? 0} lượt`} />

                            </Box>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: "space-between",
                                alignItems: "end"

                            }} >
                                <Typography component="div" variant="caption">
                                    Cập nhật 13 ngày trước
                                </Typography>
                                <Button sx={{
                                    borderRadius: 35,
                                    backgroundColor: (theme) => theme.palette.ink.main,
                                    padding: '0.5em 2em'

                                }} size="medium" variant='contained' onClick={() => { router.push(`my-works/${story.id}`) }} >
                                    Viết tiếp
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

            </>

        );
    }

    const setName = (searchVal) => {

    }
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
                        justifyContent: "center",
                    }}>
                    <Container maxWidth="xl" xs={{ display: "flex", justifyContent: "center", }}>
                        <Stack spacing={3}>
                            <Stack direction="row" justifyContent="center"  >
                                <Stack sx={{ marginY: '2em' }}>
                                    <Typography variant="h3">Sáng tác của tôi</Typography>
                                </Stack>
                            </Stack>

                            <Stack spacing={4}>
                                <Grid container direction="row" alignItems="center" xs={{ height: "20px" }}>
                                    <Grid xs={8}>
                                        <TextField
                                            fullWidth
                                            id="outlined-controlled"
                                            label="Tìm kiếm"
                                            value={name}
                                            onChange={(event) => {
                                                setName(event.target.value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={4} container direction="row" justifyContent="end" columnGap={1}>
                                        <Button style={{
                                            borderRadius: 35,
                                            backgroundColor: (theme) => theme.palette.ink.main,
                                            padding: "0.5em 2em",
                                            height: "36px"

                                        }} size="small" variant='outlined' onClick={(e) => { router.push('/author-dashboard') }}>
                                            Xem thống kê
                                        </Button>
                                        <Button style={{
                                            borderRadius: 35,
                                            backgroundColor: (theme) => theme.palette.ink.main,
                                            padding: "0.5em 2em",
                                            height: "36px"

                                        }} size="small" variant='contained' onClick={() => router.push('/my-works/create', { scroll: false })
                                        }>
                                            Thêm truyện
                                        </Button>
                                    </Grid>
                                </Grid>

                                <Grid container rowSpacing={2} >
                                    {myStories?.map((story, index) => (
                                        <Grid item lg={6} xs={12} key={story.id} sx={{ paddingRight: index % 2 === 0 ? '0.5em' : '0em', paddingLeft: index % 2 !== 0 ? '0.5em' : '0em' }}>
                                            <StoryOverViewCard story={story}></StoryOverViewCard>
                                        </Grid>
                                    ))}

                                </Grid>

                            </Stack></Stack></Container>
                </Box>
            </div>

        </>
    );
};

export default MyStoryPage;