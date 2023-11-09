import { useMemo, useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Skeleton,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import AppChart from '@/components/app-chart';
import DashboardService from '@/services/dashboard';
import { getRecentDates } from '@/utils/get-recent-dates';

import { getPieChartCommonOptions } from './chart.util';
import { SHARED_SELECT_PROPS, TIME_OPTIONS } from './constant';

export const PaidRateChart = (props) => {
  const { sx } = props;
  const theme = useTheme();
  const [option, setOption] = useState('7_recent_days');
  const [dates, setDates] = useState(getRecentDates(7));
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['dashboard', 'paid', dates[0], dates[1]],
    () => DashboardService.getPaidRatio(dates[0], dates[1]),
    { enabled: Boolean(dates[0]) && Boolean(dates[1]) },
  );

  const chartOptions = useMemo(() => {
    if (!data) return null;
    const formattedSeries = Object.entries(data).map(([key, value]) => ({
      name: key,
      value,
    }));

    const result = getPieChartCommonOptions(theme, formattedSeries);
    return result;
  }, [data, theme]);

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
    setOption(event.target.value);
  };

  return (
    <Card sx={sx}>
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
        title="Người dùng theo cấp"
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
    </Card>
  );
};

PaidRateChart.protoTypes = {
  sx: PropTypes.object,
};
