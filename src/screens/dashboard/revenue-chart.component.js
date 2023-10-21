import { useState } from 'react';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import AppChart from '../../components/app-chart';
import { getLineChartCommonOptions } from './chart.util';
import { SHARED_SELECT_PROPS } from './constant';

const data = [
  {
    metric: 'profit',
    values: {
      '01-10-2023': -750,
      '02-10-2023': 0,
      '03-10-2023': -60000,
      '04-10-2023': 0,
      '05-09-2023': 0,
      '05-10-2023': 0,
      '06-09-2023': 0,
      '06-10-2023': 0,
      '07-09-2023': 0,
      '07-10-2023': 45000,
      '08-09-2023': 0,
      '08-10-2023': 0,
      '09-09-2023': 0,
      '09-10-2023': 172200,
      '10-09-2023': 0,
      '10-10-2023': 0,
      '11-09-2023': 0,
      '12-09-2023': 0,
      '13-09-2023': 0,
      '14-09-2023': 0,
      '15-09-2023': 0,
      '16-09-2023': 0,
      '17-09-2023': 0,
      '18-09-2023': 0,
      '19-09-2023': 0,
      '20-09-2023': 0,
      '21-09-2023': 0,
      '22-09-2023': 0,
      '23-09-2023': -750,
      '24-09-2023': -300,
      '25-09-2023': -1250,
      '26-09-2023': 0,
      '27-09-2023': 0,
      '28-09-2023': 0,
      '29-09-2023': 0,
      '30-09-2023': 0,
    },
  },
  {
    metric: 'revenue',
    values: {
      '01-10-2023': 0,
      '02-10-2023': 0,
      '03-10-2023': 0,
      '04-10-2023': 0,
      '05-09-2023': 0,
      '05-10-2023': 0,
      '06-09-2023': 0,
      '06-10-2023': 0,
      '07-09-2023': 0,
      '07-10-2023': 45000,
      '08-09-2023': 0,
      '08-10-2023': 0,
      '09-09-2023': 0,
      '09-10-2023': 180000,
      '10-09-2023': 0,
      '10-10-2023': 0,
      '11-09-2023': 0,
      '12-09-2023': 0,
      '13-09-2023': 0,
      '14-09-2023': 0,
      '15-09-2023': 0,
      '16-09-2023': 0,
      '17-09-2023': 0,
      '18-09-2023': 0,
      '19-09-2023': 0,
      '20-09-2023': 0,
      '21-09-2023': 0,
      '22-09-2023': 0,
      '23-09-2023': 0,
      '24-09-2023': 0,
      '25-09-2023': 0,
      '26-09-2023': 0,
      '27-09-2023': 0,
      '28-09-2023': 0,
      '29-09-2023': 0,
      '30-09-2023': 0,
    },
  },
];

const OPTIONS = [
  { label: 'Tuần này', value: 'last_week' },
  { label: 'Tháng này', value: 'last_month' },
  { label: 'Năm nay', value: 'last_year' },
  { label: 'Tùy chọn', value: 'custom' },
];

export const RevenueChart = (props) => {
  const { sx } = props;
  const theme = useTheme();

  const categories = Object.keys(data[0].values);
  const formattedSeries = data.map((series) => ({
    name: series.metric,
    data: Object.values(series.values),
  }));
  const chartOptions = getLineChartCommonOptions(
    theme,
    categories,
    formattedSeries,
  );

  const [option, setOption] = useState('last_week');

  const handleRefresh = () => {};
  const handleChange = (event) => {
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
                value={option}
                label="Thời gian"
                onChange={handleChange}>
                {OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Button>
          </Stack>
        }
        title="Doanh thu"
      />
      <CardContent>
        <AppChart
          renderMode={'canvas'}
          option={chartOptions}
          height="380px"
          settings={{ notMerge: true }}
        />
      </CardContent>
    </Card>
  );
};

RevenueChart.protoTypes = {
  sx: PropTypes.object,
};
