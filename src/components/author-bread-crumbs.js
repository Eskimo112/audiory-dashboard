import React, { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { ExpandMore } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';

const renderRouteName = (routeName) => {
  return routeName;
};
const AuthorBreadCrumbs = ({
  storyTitle,
  storyGenerator,
  chapterTitle,
  handleOpen,
}) => {
  const router = useRouter();
  const requestHeader = useRequestHeader();
  const paths = router.asPath.slice(1).split('/');
  const routes = router.route.slice(1).split('/');
  const [title, setTitle] = React.useState(storyTitle);
  const [cTitle, setCTitle] = React.useState(chapterTitle);
  const storyId = router.asPath.slice(1).split('/')[1];
  const {
    data: storyData = {},
    isLoading,
    isSuccess,
  } = useQuery(
    ['story', storyId],
    async () => await new StoryService(requestHeader).getMyStoryById(storyId),
    { refetchOnWindowFocus: false, enabled: Boolean(storyId) },
  );
  useEffect(() => {
    setTitle(storyData?.title);
  }, [storyData, isSuccess]);

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
              sx={{
                fontSize: '14px',
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
          accumulativeRoute =
            paths.length === 3 ? cTitle ?? '' : paths[2] === 'write' ? 'Viết' : 'Xem trước';
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
          sx={{
            fontSize: '14px',
            color: 'ink.main',
            maxWidth: '20em',
            textOverflow: 'ellipsis',
            textDecoration: 'underline',
            fontWeight: '600',
          }}>
          {/* {ROUTE_NAME_MAP[accumulativeRoute]} */}
          {renderRouteName(accumulativeRoute)}
        </Typography>
        {result.length < 2 ? (
          <></>
        ) : (
          <IconButton
            color="inherit"
            aria-label=""
            onClick={(e) => {
              handleOpen(e, storyData);
            }}>
            <ExpandMore />
          </IconButton>
        )}
      </Grid>,
    );
    return result;
  }, [cTitle, handleOpen, paths, storyData, title]);

  return (
    <Box sx={{ marginTop: '1em' }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {isLoading ? <></> : breadcrums}
      </Breadcrumbs>
      <Divider />
    </Box>
  );
};

export default AuthorBreadCrumbs;
