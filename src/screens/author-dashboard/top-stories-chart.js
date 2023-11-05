import { useMemo, useState } from 'react';

import {
  Button,
  Card,
  CardHeader,
  MenuItem,
  Select,
  Skeleton,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import AppChart from '../../components/app-chart';
import { useRequestHeader } from '../../hooks/use-request-header';
import AuthorDashboardService from '../../services/author-dashboard';
import { getRecentDates } from '../../utils/get-recent-dates';
import {
  METRIC_OPTIONS,
  SHARED_SELECT_PROPS,
  TIME_OPTIONS,
} from '../dashboard/constant';
import { getAuthorPieChartCommonOptions } from './chart.utils';

export const TopStoriesChart = (props) => {
  const theme = useTheme();
  const requestHeader = useRequestHeader();
  const [timeOption, setTimeOption] = useState('7_recent_days');
  const [metricOption, setMetricOption] = useState('total_read');
  const [dates, setDates] = useState(getRecentDates(7));
  const { data, isLoading, isFetching } = useQuery(
    ['author', 'story-ranking', dates[0], dates[1]],
    () =>
      new AuthorDashboardService(requestHeader).getStoryRanking(
        dates[0],
        dates[1],
        metricOption,
      ),
    { enabled: Boolean(dates[0]) && Boolean(dates[1]) },
  );

  const chartOptions = useMemo(() => {
    if (!data) return null;

    const formattedSeries = data.map((story) => ({
      name: story.title,
      value: story[metricOption],
    }));

    const result = getAuthorPieChartCommonOptions(theme, formattedSeries);
    return result;
  }, [data, metricOption, theme]);

  // const handleRefresh = async () => {
  //   await refetch();
  // };

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
    setTimeOption(event.target.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        action={
          <Stack direction="row" gap="8px">
            {/* <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={
                <SvgIcon fontSize="small">
                  <ArrowPathIcon />
                </SvgIcon>
              }>
              Làm mới
            </Button> */}
            <Button color="inherit" size="small" sx={{ padding: 0 }}>
              <Select
                {...SHARED_SELECT_PROPS}
                sx={{ padding: 0 }}
                value={timeOption}
                label="Thời gian"
                onChange={handleChange}>
                {TIME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Button>
            <Button color="inherit" size="small" sx={{ padding: 0 }}>
              <Select
                {...SHARED_SELECT_PROPS}
                sx={{ padding: 0 }}
                value={metricOption}
                label="Thông số"
                onChange={(event) => setMetricOption(event.target.value)}>
                {METRIC_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Button>
          </Stack>
        }
        title="Truyện tương tác tốt"
      />
      {isLoading || isFetching ? (
        <Skeleton height={'380px'} width="100%" />
      ) : (
        <AppChart
          renderMode={'canvas'}
          option={chartOptions}
          height="320px"
          settings={{ notMerge: true }}
        />
      )}
    </Card>
  );
};

TopStoriesChart.protoTypes = {
  sx: PropTypes.object,
};
