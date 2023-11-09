import * as React from 'react';
import { useState } from 'react';

import Head from "next/head";
import { useRouter } from 'next/router';

import {
    Box,
    Container,
    Stack,
} from '@mui/material';

import AuthorBreadCrumbs from '@/components/author-bread-crumbs';
import StoryForm from '@/components/forms/author-form/story-form';



const NewStoryPage = () => {
    const router = useRouter();
    console.log(router.query.id === 'new-story')
    const [storyId, setStoryId] = useState(router.query.id)
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
                        <AuthorBreadCrumbs />
                        <Stack>
                            <StoryForm />
                        </Stack>

                    </Container>
                </Box>
            </div>

        </>
    );
};

export default NewStoryPage;