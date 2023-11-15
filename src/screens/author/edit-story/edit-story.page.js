// Render Prop
import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { Box, Card, CircularProgress, Container, Grid, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useQuery } from "react-query";

import { AppImageUpload } from '@/components/app-image-upload';
import AuthorBreadCrumbs from '@/components/author-bread-crumbs';
import ChapterListTab from '@/components/forms/author-form/tabs/chapter-list-tab';
import DetailStoryTab from '@/components/forms/author-form/tabs/detail-story-tab';
import { useRequestHeader } from '@/hooks/use-request-header';
import ChapterService from '@/services/chapter';
import StoryService from '@/services/story';
import { toastError, toastSuccess } from '@/utils/notification';



function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const EditStoryPage = () => {
    const router = useRouter();

    const storyId = router.query.id;
    const requestHeader = useRequestHeader();
    const [tabValue, setTabValue] = useState(0);
    const [imageFile, setImageFile] = useState();

    const handleChangeTab = (event, newValue) => {
        if (newValue === 0) {
            console.log('alo')
            refetch();
        }
        setTabValue(newValue);
    }

    const { data: story = {}, isLoading, refetch, isRefetching } = useQuery(
        ['story', storyId],
        async () => await new StoryService(requestHeader).getById(storyId),
    );
    // chapter handler
    const onPublishChapter = async ({ chapterId, isPublish = true }) => {
        console.log('chapterId', chapterId);
        console.log('isPublish', isPublish);
        if (isPublish) {
            await new ChapterService().publish(chapterId).then(res => {
                console.log(res)
                if (res.code === 200) {
                    toastSuccess('Đăng tải thành công');
                    refetch();
                } else {
                    toastError(res.message);
                }
            })

        } else {
            try {
                await new ChapterService().unpublish(chapterId).then(res => {
                    if (res.code === 200) {
                        toastSuccess('Gỡ đăng tải thành công');
                        refetch();
                    } else {
                        toastError(res.message);
                    }
                })

            } catch (error) {
                console.log(error)
                toastError('Gỡ đăng tải không thành công')
            }

        }
    }
    const onDeleteChapter = async ({ chapterId, isLast = false }) => {
        console.log('chapterId', chapterId);
        console.log('isPublish', isLast);
        await new ChapterService().delete(chapterId).then(res => {
            console.log(res);
            // if (res.code === 200) {
            //     toastSuccess('Xóa thành công');
            //     refetch();
            // } else {
            //     toastError(res.message);
            // }
        })
        // if (isLast) {
        //     await new ChapterService().delete(chapterId).then(res => {
        //         console.log(res)
        //         if (res.code === 200) {
        //             toastSuccess('Xóa thành công');
        //             refetch();
        //         } else {
        //             toastError(res.message);
        //         }
        //     })
        // }
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
            <div>

                <Container maxWidth="lg">
                    <AuthorBreadCrumbs storyTitle={story.title} />
                    <Box
                        container
                        justifyContent="center"
                        direction="row"
                        alignItems="center"
                        alignContent="center"
                        wrap="wrap"
                    >
                        <Container sx={{
                            width: "18em",
                        }} >
                            <AppImageUpload defaultUrl={story.cover_url ?? ''} onChange={(file) => setImageFile(file)} />
                        </Container>
                    </Box>
                </Container>

                <Container sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", justifyContent: "center" }}>

                    <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                        <Tab label="Chi tiết truyện" {...a11yProps(0)} />
                        <Tab label="Mục lục" {...a11yProps(1)} />
                    </Tabs>
                </Container>
                <CustomTabPanel value={tabValue} index={0}>
                    {isRefetching ? <Skeleton /> : <DetailStoryTab story={story} handleRefetch={refetch} />}
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <Container maxWidth="lg" sx={{ width: 1 / 2 }}>
                        {isLoading || isRefetching ? <div>
                            {Array(10).map((e, index) => <Skeleton key={index} animation="wave" />)}
                        </div> : <ChapterListTab list={story.chapters ?? []} storyId={storyId} refetch={refetch} onPublish={onPublishChapter} onDelete={onDeleteChapter} />}

                    </Container>
                </CustomTabPanel>


            </div>

        </>
    )

};

export default EditStoryPage;