import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  TablePagination,
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
        sx={{ cursor: 'pointer' }}
        alignItems="center"
        direction="row"
        spacing={1}
        maxWidth="100px"
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
          sx={{ objectFit: 'cover' }}></Box>
        <Stack maxWidth={200}>
          <Typography
            variant="subtitle2"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            fontWeight={600}>
            {story.title ?? 'Không có tên'}
          </Typography>
          <Typography
            variant="subtitle2"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            fontWeight={400}
            fontStyle="italic">
            {story.author.full_name ?? 'Không có tên'}
          </Typography>
        </Stack>
      </Stack>
      <Stack alignItems="flex-end">
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {formatStatistic(story.total_read)} lượt đọc
        </Typography>
        <Typography variant="body2" fontWeight={600} color="secondary.main">
          {formatStatistic(story.total_vote)} bình chọn
        </Typography>
      </Stack>
    </Stack>
  );
};

const TopStoriesTable = () => {
  const requestHeader = useRequestHeader();
  const [page, setPage] = useState(1);
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
          <Stack gap="8px">
            {paginatedStories.map((story, index) => (
              <RankingStoryCard
                index={index + 1}
                story={story}
                key={story.id}></RankingStoryCard>
            ))}
            <TablePagination
              component="div"
              count={stories.length}
              page={page}
              onPageChange={(_, page) => setPage(page)}
              rowsPerPage={5}
              labelRowsPerPage={null}
            />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TopStoriesTable;
