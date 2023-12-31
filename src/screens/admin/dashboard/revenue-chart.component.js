import { useMemo, useState } from 'react';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { DateRangePicker } from '@mantine/dates';
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
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import AppChart from '@/components/app-chart';
import { useRequestHeader } from '@/hooks/use-request-header';
import DashboardService from '@/services/dashboard';
import { getRecentDates } from '@/utils/get-recent-dates';

import { getLineChartCommonOptions } from './chart.util';
import { SHARED_SELECT_PROPS, TIME_OPTIONS } from './constant';

const REVENUE_MAP = {
  revenue: 'Doanh thu',
  profit: 'Lợi nhuận',
};

export const RevenueChart = (props) => {
  const { sx } = props;
  const theme = useTheme();
  const requestHeader = useRequestHeader();
  const [option, setOption] = useState('7_recent_days');
  const [dates, setDates] = useState(getRecentDates(7));
  const [openMenu, setOpenMenu] = useState(false);
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['dashboard', 'revenue', dates[0], dates[1]],
    () => new DashboardService(requestHeader).getRevenue(dates[0], dates[1]),
    {
      enabled: Boolean(dates[0]) && Boolean(dates[1]),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const chartOptions = useMemo(() => {
    if (!data) return null;
    const analytics = data.analytics;
    if (!analytics) return null;
    const categories = Object.keys(analytics[0].values);
    const formattedSeries = analytics.map((series) => ({
      name: REVENUE_MAP[series.metric],
      data: Object.values(series.values),
    }));
    const result = getLineChartCommonOptions(
      theme,
      categories,
      formattedSeries,
    );
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
                open={openMenu}
                onOpen={() => setOpenMenu(true)}
                {...SHARED_SELECT_PROPS}
                value={option}
                label="Thời gian"
                onChange={handleChange}
                renderValue={(value) => {
                  if (value === 'custom') return 'Tùy chọn';
                  return TIME_OPTIONS.find((option) => option.value === value)
                    .label;
                }}>
                {TIME_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    onClick={() => setOpenMenu(false)}>
                    {option.label}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  value="custom">
                  <DateRangePicker
                    inputFormat="YYYY/MM/DD"
                    withinPortal={true}
                    placeholder="Tùy chọn"
                    zIndex={10000}
                    defaultValue={
                      option === 'custom'
                        ? [dayjs(dates[0]).toDate(), dayjs(dates[1]).toDate()]
                        : null
                    }
                    onChange={(value) => {
                      if (value[0] && value[1]) {
                        setDates([
                          dayjs(value[0]).format('YYYY-MM-DD'),
                          dayjs(value[1]).format('YYYY-MM-DD'),
                        ]);
                        setOption('custom');
                        setOpenMenu(false);
                      }
                    }}
                  />
                </MenuItem>
              </Select>
            </Button>
          </Stack>
        }
        title="Tổng doanh thu và Lợi nhuận"
      />
      <CardContent>
        {isLoading || isFetching ? (
          <Skeleton height={'380px'} width="100%" />
        ) : (
          <AppChart
            renderMode={'canvas'}
            option={chartOptions}
            height="380px"
            settings={{ notMerge: true }}
          />
        )}
      </CardContent>
    </Card>
  );
};

RevenueChart.protoTypes = {
  sx: PropTypes.object,
};
