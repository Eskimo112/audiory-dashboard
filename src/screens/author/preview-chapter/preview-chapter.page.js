import React, { useEffect, useState } from "react";

import 'react-quill/dist/quill.snow.css';

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FastForward, FastRewind, FavoriteBorderOutlined, FavoriteOutlined, GifBoxOutlined, Image, ListAlt, PlayArrow, Settings, SettingsOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, IconButton, makeStyles, Skeleton, Stack, Typography } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { any } from "prop-types";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useQuery } from "react-query";

import { useAuth } from "@/hooks/use-auth";
import ChapterService from "@/services/chapter";
import ChapterVersionService from "@/services/chapter-version";
import { toastError, toastSuccess } from "@/utils/notification";
import AppImage from "@/components/app-image";


const { useRouter } = require("next/router")

const PreviewChapterPage = () => {
    const router = useRouter();
    const auth = useAuth();
    const jwt = auth.user.token;
    const [chapter, setChapter] = useState({ title: '' });
    const [chapterId, setChapterId] = useState('');

    const [value, setValue] = useState('');
    const [html, setHtml] = useState('<p></p>');

    const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

    const { data: chapterVersionData = [], isLoading, isSucces, refetch } = useQuery(
        ['chapterVersionData', router.isReady],
        async () => await ChapterVersionService.getById(router.query['chapter-version-id']),
    );


    const { data: chapterData = [], isLoading2 } = useQuery(
        ['chapterData', isSucces],
        async () => await ChapterService.getById({ chapterId: chapterVersionData?.chapter_id, jwt }),

    );
    useEffect(() => {
        setValue(JSON.parse(chapterVersionData?.rich_text === '' ?? '{}'));
        setChapterId(chapterVersionData.chapter_id);
        var cfg = {};
        var converter = new QuillDeltaToHtmlConverter(value, cfg);

        setHtml(converter.convert())

    }, [chapterVersionData, isSucces, chapterData])

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
                <Grid xs={{ width: '100%' }} container direction="column" alignItems="center">
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        alignContent="center"
                        xs={12}
                    >

                        <CardContent>
                            <Typography component="div" variant="h6">
                                Nghe audio
                            </Typography>
                        </CardContent>
                    </Grid>

                    <Grid container xs={12} direction="column" >
                        <Grid xs={12} >
                            <BorderLinearProgress variant="determinate" value={35} sx={{ margin: '0em 1em' }} />
                        </Grid>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        ><IconButton aria-label="previous">
                                {theme.direction === 'rtl' ? <FastForward /> : <FastRewind />}
                            </IconButton>
                            <IconButton aria-label="play/pause">
                                <PlayArrow sx={{ height: 38, width: 38 }} />
                            </IconButton>
                            <IconButton aria-label="next" >
                                {theme.direction === 'rtl' ? <FastRewind /> : <FastForward />}
                            </IconButton>

                        </Stack>


                    </Grid>
                </Grid>
            </Card>
        );
    }
    console.log(chapterData);
    console.log(chapterVersionData);

    const handleRevertChapterVersion = async (e) => {
        e.preventDefault();

        try {
            await ChapterVersionService.revert({ chapterVersionId: router.query['chapter-version-id'] });
            toastSuccess('Khôi phục thành công');

            router.push(`/my-works/${router.query.id}/write/${chapterId}`);

        } catch (error) {
            toastError('Khôi phục không thành công')

        }
    }

    return (
        <>
            <Grid container direction="column"
                alignItems="center" sx={{ margin: '1em 0' }}>
                <Grid container>
                    {/* <image src={chapterVersionData?.banner_url} /> */}
                    {/* {isLoading ? <Skeleton /> : <Card><CardMedia alt='Banner' image={chapterVersionData?.banner_url === "" ? "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png" : chapterVersionData?.banner_url ?? ""} width="20em" height="10em" loading="lazy" /></Card>} */}
                </Grid>
                <Grid spacing={0} container direction="column" alignItems="center" sx={{ margin: '2em 0' }}>
                    <Typography variant="h6" color="initial">{isLoading2 ? <Skeleton /> : `Chương ${chapterData?.position ?? 1}`}    <Typography variant="overline" color="initial">({chapterData?.is_draft ? 'Bản thảo' : 'Đă đăng tải'})</Typography></Typography>
                    <Typography variant="h6" color="initial">{isLoading2 ? <Skeleton /> : chapterData?.title ?? 'Tiêu đề'} </Typography>
                </Grid>

                <Grid xs={8} direction="row" container >
                    <Grid xs={2} >
                        <Typography variant="h5" color="initial"></Typography>
                    </Grid>
                    <Grid xs={8} >
                        {isLoading ? <Skeleton /> : <MediaControlCard />}

                        {isLoading ? <Skeleton sx={{ bgcolor: 'sky.light' }}
                            variant="rectangular"
                            width="100%"
                            height={118} /> : <ReactQuill
                            readOnly theme='bubble' value={JSON.parse(chapterVersionData?.rich_text === "" ? '{}' : chapterVersionData?.rich_text)} />}
                        <Button fullWidth variant="contained" color="primary" sx={{ margin: "1em 0" }}>
                            Đọc phần tiếp theo
                        </Button>
                        <Button fullWidth variant="outlined" color="primary" onClick={handleRevertChapterVersion}>
                            Khôi phục
                        </Button>
                    </Grid>
                    <Grid xs={2} spacing={0} container justifyContent="center" direction="column">
                        <Container maxWidth="2em">
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
                        </Container>
                    </Grid>
                </Grid>
            </Grid>


        </>
    )
}

export default PreviewChapterPage;