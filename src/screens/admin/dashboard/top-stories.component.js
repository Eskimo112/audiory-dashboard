import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import { FavoriteOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';

import DashboardService from '../../../services/dashboard';
import { formatStatistic } from '../../../utils/formatters';
import { getRecentDates } from '../../../utils/get-recent-dates';
import { SHARED_SELECT_PROPS, TIME_OPTIONS } from './constant';

const RankingStoryCard = ({ index, story }) => {
  const router = useRouter();

  return (
    <Stack
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      //   sx={{ bgcolor: 'primary.alpha10', p: '6px', borderRadius: '8px' }}
    >
      <Stack
        sx={{
          cursor: 'pointer',
          flexGrow: 1,
          overflow: 'hidden',
        }}
        alignItems="center"
        direction="row"
        spacing={1}
        onClick={() => {
          router.push(`/admin/stories/${story.id}`);
        }}>
        <Typography variant="body2" fontWeight={600} sx={{ pr: '8px' }}>
          {index}
        </Typography>
        <Box
          component="img"
          src={story.cover_url}
          minWidth={45}
          height={65}
          sx={{ objectFit: 'cover', borderRadius: '4px' }}></Box>
        <Stack
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          <Typography variant="subtitle2" fontWeight={600} whiteSpace="normal">
            {story.title ?? 'Không có tên'}
          </Typography>
          <Typography variant="subtitle2" fontWeight={400} fontStyle="italic">
            {story.author.full_name ?? 'Không có tên'}
          </Typography>
        </Stack>
      </Stack>
      <Stack flexShrink={0} alignItems="flex-end">
        <Typography
          variant="body2"
          fontWeight={600}
          color="primary.main"
          sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {formatStatistic(story.total_read) + ' '}
          <SvgIcon fontSize="14px">
            <EyeIcon />
          </SvgIcon>
        </Typography>
        <Typography
          variant="body2"
          fontWeight={600}
          color="secondary.main"
          sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {formatStatistic(story.total_vote) + ' '}
          <SvgIcon fontSize="14px">
            <FavoriteOutlined />
          </SvgIcon>
        </Typography>
      </Stack>
    </Stack>
  );
};

const TopStoriesTable = () => {
  const requestHeader = useRequestHeader();
  const [page, setPage] = useState(0);
  const [option, setOption] = useState('7_recent_days');
  const [dates, setDates] = useState(getRecentDates(7));
  const {
    data: stories = [],
    isLoading,
    refetch,
  } = useQuery(
    ['dashboard', 'story-ranking', dates[0], dates[1]],
    async () =>
      await new DashboardService(requestHeader).getStoryRanking(
        dates[0],
        dates[1],
        1,
        1000,
      ),
    { enabled: Boolean(dates[0]) && Boolean(dates[1]) },
  );

  const handleChange = (event) => {
    switch (event.target.value) {
      case '7_recent_days': {
        setDates(getRecentDates(7));
        break;
      }
      case '14_recent_days': {
        setDates(getRecentDates(14));
        break;
      }
      case '30_recent_days': {
        setDates(getRecentDates(30));
        break;
      }
      case '90_recent_days': {
        setDates(getRecentDates(90));
        break;
      }
    }
    setOption(event.target.value);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const paginatedStories = useMemo(() => {
    console.log(page);
    return stories.slice(page * 5, page * 5 + 5);
  }, [page, stories]);

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        action={
          <Stack direction="row" gap="8px">
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={
                <SvgIcon fontSize="small">
                  <ArrowPathIcon />
                </SvgIcon>
              }>
              Làm mới
            </Button>
            <Button color="inherit" size="small" sx={{ padding: 0 }}>
              <Select
                {...SHARED_SELECT_PROPS}
                sx={{ padding: 0 }}
                value={option}
                label="Thời gian"
                onChange={handleChange}>
                {TIME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Button>
          </Stack>
        }
        title="Truyện nổi tiếng"
      />
      <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Stack gap="8px" justifyContent="center" alignItems="center">
            {paginatedStories.map((story, index) => (
              <RankingStoryCard
                index={index + 1}
                story={story}
                key={story.id}></RankingStoryCard>
            ))}
            <Pagination
              count={Math.ceil(stories.length / 5)}
              page={page}
              onChange={(_, page) => setPage(page)}
            />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TopStoriesTable;
