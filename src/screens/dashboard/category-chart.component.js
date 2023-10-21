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
import { getBarChartCommonOptions } from './chart.util';
import { SHARED_SELECT_PROPS } from './constant';

const data = [
  {
    metric: 'revenue',
    values: {
      'Bí ẩn': 2500,
      'Hài huớc': 46000,
      'Hành động': 1000,
      'Khoa học viễn tưởng': 9000,
      'Ma cà rồng': 2500,
      'Tiểu thuyết thiếu niên': 7500,
      'Viễn tưởng': 1500,
    },
  },
];

const OPTIONS = [
  { label: 'Tuần này', value: 'last_week' },
  { label: 'Tháng này', value: 'last_month' },
  { label: 'Năm nay', value: 'last_year' },
  { label: 'Tùy chọn', value: 'custom' },
];

export const CategoryChart = (props) => {
  const { sx } = props;
  const theme = useTheme();

  const categories = Object.keys(data[0].values);
  const formattedSeries = data.map((series) => ({
    name: series.metric,
    data: Object.values(series.values),
  }));

  const chartOptions = getBarChartCommonOptions(
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
                sx={{ padding: 0 }}
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
          height="280px"
          settings={{ notMerge: true }}
        />
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
