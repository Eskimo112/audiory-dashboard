import React, { createContext, useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { ExpandMore } from '@mui/icons-material';
import { Box, Breadcrumbs, Chip, Divider, Grid, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { emphasize } from '@mui/system';
import { useQuery } from 'react-query';

import { useAuth } from '@/hooks/use-auth';
import StoryService from '@/services/story';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const renderRouteName = (routeName) => {
    return routeName;

}
const AuthorBreadCrumbs = ({ storyTitle, storyGenerator, chapterTitle, handleOpen }) => {

    const router = useRouter();
    const auth = useAuth();
    const jwt = auth.user.token;
    const paths = router.asPath.slice(1).split('/');
    const routes = router.route.slice(1).split('/');
    const [title, setTitle] = React.useState(storyTitle);
    const [cTitle, setCTitle] = React.useState(chapterTitle);

    const { data: storyData = {}, isLoading, isSuccess } = useQuery(
        ['story', storyGenerator === true, router.isReady],
        async () => await StoryService.getById({ storyId: router.asPath.slice(1).split('/')[1], jwt }),
    );
    useEffect(() => {
        setTitle(storyData?.title)
    }, [storyData, isSuccess])

    console.log('DATA', storyData)
    const breadcrums = useMemo(() => {
        const result = [];
        let accumulativeLink = '';
        let accumulativeRoute = '';

        paths.forEach((path, index) => {
            if (index !== 0) {
                result.push(
                    <Link
                        key={index}
                        href={accumulativeLink}
                        style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '16px',
                                color: 'ink.main',
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                            }}>
                            {renderRouteName(accumulativeRoute)}
                            {/* {ROUTE_NAME_MAP[accumulativeRoute]} */}
                        </Typography>
                    </Link>,
                );
            }
            accumulativeLink += '/' + path;

            switch (index) {
                case 1:
                    accumulativeRoute = title;
                    break;
                case 2:
                    accumulativeRoute = paths.length === 3 ? cTitle ?? '' : '';
                    break;
                case 3:
                    accumulativeRoute = cTitle;
                    break;
                default:
                    accumulativeRoute = 'Danh sách truyện của tôi';
                    break;
            }
            //  routes name change base on routes length
            // console.log('Link ', accumulativeLink);
            // console.log('Route ', accumulativeRoute);
        }, '/');
        result.push(
            <Grid container spacing={0} alignItems="center">
                <Typography

                    noWrap
                    variant="subtitle1"
                    sx={{ fontSize: '16px', color: 'ink.lighter', maxWidth: "20em", textOverflow: "ellipsis", textDecoration: "underline" }}>
                    {/* {ROUTE_NAME_MAP[accumulativeRoute]} */}
                    {renderRouteName(accumulativeRoute)}
                </Typography>
                {result.length < 2 ? <></> : <IconButton color='inherit' aria-label="" onClick={(e) => { handleOpen(e, storyData) }}>
                    <ExpandMore />
                </IconButton>}
            </Grid>

        );
        return result;
    }, [paths, routes]);

    return (

        <Box sx={{ marginTop: "1em" }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" >
                {isLoading ? <></> : breadcrums}
            </Breadcrumbs>
            <Divider />
        </Box>

    );
};

export default AuthorBreadCrumbs;
