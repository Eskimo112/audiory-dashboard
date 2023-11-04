import React, { useEffect, useState } from 'react';

import Head from "next/head";
import { useRouter } from 'next/router';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import { Comment, FavoriteBorder, Menu, MenuBook, MoreVert } from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    Grid,
    Stack,
    SvgIcon,
    TextField,
    Typography
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';

import { usePopover } from '@/hooks/use-popover';
import { MyStoryPopover } from '@/layouts/author/my-story-popover';
import StoryService from '@/services/story';
import { useAuth } from '@/hooks/use-auth';


const MyStoryPage = () => {
    const router = useRouter();
    const auth = useAuth();
    const myStoryPopover = usePopover();
    const [myStories, setMyStories] = useState([]);

    useEffect(() => {
        StoryService.getMyStories(auth.user.token).then((res) => {
            setMyStories(res);
        });

    }, [])

    const StoryOverViewCard = ({ story }) => {
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
        return (
            <>
                <Card onClick={() => { router.push(`my-works/${story.id}`) }} aria-describedby="alo" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 1 / 3 }}
                        image={story.cover_url !== '' ? story.cover_url : "https://imgv3.fotor.com/images/gallery/Fiction-Book-Covers.jpg"}
                        alt="Live from space album cover"
                    />

                    <CardContent sx={{ display: 'flex', flexDirection: 'column', width: 2 / 3 }}>
                        <Stack direction="column"  >
                            <Stack direction="row" justifyContent="flex-end">
                                <Box sx={{}}>
                                    <IconButton onClick={myStoryPopover.handleOpen}
                                        ref={myStoryPopover.anchorRef} aria-label="previous">
                                        <MoreVert></MoreVert>
                                    </IconButton>
                                </Box>
                            </Stack>

                            <Typography component="div" variant="h5">
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

                                }} size="medium" variant='contained'>
                                    Viết tiếp
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
                <MyStoryPopover
                    id="1"
                    anchorEl={myStoryPopover.anchorRef.current}
                    open={myStoryPopover.open}
                    onClose={myStoryPopover.handleClose}
                />
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
                            <Stack direction="row" justifyContent="center" spacing={4}   >
                                <Stack spacing={1}>
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

                                        }} size="small" variant='outlined'>
                                            Xem thống kê
                                        </Button>
                                        <Button style={{
                                            borderRadius: 35,
                                            backgroundColor: (theme) => theme.palette.ink.main,
                                            padding: "0.5em 2em",
                                            height: "36px"

                                        }} size="small" variant='contained' onClick={() => router.push('/my-works/new-story', { scroll: false })
                                        }>
                                            Thêm truyện
                                        </Button>
                                    </Grid>
                                </Grid>

                                <Grid container rowSpacing={1} columnSpacing={2}>

                                    {myStories.map((story) => (
                                        <Grid lg={6} xs={12} key={story.id}>
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