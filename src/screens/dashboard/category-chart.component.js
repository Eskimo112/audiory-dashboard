import { useMemo, useState } from 'react';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  SvgIcon,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import AppChart from '../../components/app-chart';
import DashboardService from '../../services/dashboard';
import { getRecentDates } from '../../utils/get-recent-dates';
import { getBarChartCommonOptions } from './chart.util';
import { SHARED_SELECT_PROPS, TIME_OPTIONS } from './constant';

// const data = [
//   {
//     metric: 'revenue',
//     values: {
//       'Bí ẩn': 2500,
//       'Hài huớc': 46000,
//       'Hành động': 1000,
//       'Khoa học viễn tưởng': 9000,
//       'Ma cà rồng': 2500,
//       'Tiểu thuyết thiếu niên': 7500,
//       'Viễn tưởng': 1500,
//     },
//   },
// ];

export const CategoryChart = (props) => {
  const { sx } = props;
  const theme = useTheme();
  const [option, setOption] = useState('7_recent_days');
  const [dates, setDates] = useState(getRecentDates(7));
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['dashboard', 'categories', 'revenue', dates[0], dates[1]],
    () => DashboardService.getCategoriesRevenue(dates[0], dates[1]),
    { enabled: Boolean(dates[0]) && Boolean(dates[1]) },
  );

  const chartOptions = useMemo(() => {
    if (!data) return null;
    const analytics = data.analytics;
    if (!analytics) return null;
    const categories = Object.keys(analytics[0].values).sort(
      (a, b) => analytics[0].values[b] - analytics[0].values[a],
    );
    const formattedSeries = analytics.map((series) => ({
      name: series.metric,
      data: Object.values(series.values).sort((a, b) => b - a),
    }));
    const result = getBarChartCommonOptions(theme, categories, formattedSeries);
    return result;
  }, [data, theme]);

  const handleRefresh = async () => {
    await refetch();
  };

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

  return (
    <Card sx={sx}>
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
        title="Doanh thu theo thể loại"
      />
      <CardContent>
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
      </CardContent>
      {/* <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          Overview
        </Button>
      </CardActions> */}
    </Card>
  );
};

CategoryChart.protoTypes = {
  sx: PropTypes.object,
};
