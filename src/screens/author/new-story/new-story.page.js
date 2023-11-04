import * as React from 'react';
import { useState } from 'react';

import Head from "next/head";
import { useRouter } from 'next/router';

import {
    Box,
    Container,
    Stack,
} from '@mui/material';

import StoryForm from '@/components/forms/author-form/story-form';
import PreviewStoryPage from '../preview-story/preview-story.page';
import EditStoryForm from '@/components/forms/author-form/edit-story-form';


const NewStoryPage = () => {
    const router = useRouter();

    const [storyId, setStoryId] = useState(router.query.id === 'new-story' ? '' : router.query.id)
    console.log(router.query.id)
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
                    <Container sx={{ width: '100%' }}>

                        {storyId === '' ? <Stack>
                            <StoryForm />
                        </Stack> : <Stack>
                            <EditStoryForm storyId={storyId} />
                        </Stack>}




                    </Container>
                </Box>
            </div>

        </>
    );
};

export default NewStoryPage;