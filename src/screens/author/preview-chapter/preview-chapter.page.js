import React, { useEffect, useState } from "react";

import 'react-quill/dist/quill.snow.css';

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FastForward, FastRewind, FavoriteBorderOutlined, FavoriteOutlined, GifBoxOutlined, ListAlt, PlayArrow, Settings, SettingsOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Grid, IconButton, makeStyles, Stack, Typography } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import ChapterVersionService from "@/services/chapter-version";


const { useRouter } = require("next/router")

const PreviewChapterPage = () => {
    const router = useRouter();
    const [chapter, setChapter] = useState({ title: '' });
    const [chapterId, setChapterId] = useState('');
    const [value, setValue] = useState([]);
    const [html, setHtml] = useState('<p></p>');

    const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

    useEffect(() => {
        const fetchChapterVersion = async () => {
            const res = await ChapterVersionService.getById(router.query['chapter-version-id'])
            setValue(JSON.parse(res.rich_text));
            setChapterId(res.chapter_id);
            var cfg = {};

            var converter = new QuillDeltaToHtmlConverter(value, cfg);

            setHtml(converter.convert())

        }
        // const fetchChapter = async () => {
        //     const res = await ChapterService.getById(chapterId);
        //     setChapter(res)
        // }

        fetchChapterVersion();
        // fetchChapter();

    }, [value])



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
                            <BorderLinearProgress variant="determinate" value={50} sx={{ margin: '0em 1em' }} />
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

    return (
        <>
            <Grid container direction="column"
                alignItems="center" sx={{ marginTop: '2em' }}>
                <Grid spacing={0} container sx={12} direction="column" alignItems="center">
                    <Typography variant="h5" color="initial">Chương 1</Typography>
                    <Typography variant="overline" color="initial">(Bản thảo)</Typography>

                    <Typography variant="h6" color="initial">Tiêu đề</Typography>

                </Grid>

                <Grid xs={8} direction="row" container >
                    <Grid xs={2} >
                        <Typography variant="h5" color="initial">Data info</Typography>
                    </Grid>
                    <Grid xs={8} >
                        <MediaControlCard />
                        <ReactQuill
                            readOnly theme='bubble' value={html} />
                        <Button fullWidth variant="contained" color="primary">
                            Đọc phần tiếp theo
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