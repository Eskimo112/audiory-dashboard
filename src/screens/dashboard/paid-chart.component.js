import { useState } from 'react';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  SvgIcon,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import AppChart from '../../components/app-chart';
import { getPieChartCommonOptions } from './chart.util';

const data = {
  paid_users: 1.8657,
  free_users: 98.1343,
};

const OPTIONS = [
  { label: 'Tuần này', value: 'last_week' },
  { label: 'Tháng này', value: 'last_month' },
  { label: 'Năm nay', value: 'last_year' },
  { label: 'Tùy chọn', value: 'custom' },
];

export const PaidRateChart = (props) => {
  const { sx } = props;
  const theme = useTheme();

  //   const categories = Object.keys(data);
  const formattedSeries = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  const chartOptions = getPieChartCommonOptions(theme, formattedSeries);

  const [option, setOption] = useState('last_week');

  const handleRefresh = () => {};
  const handleChange = (event) => {
    setOption(event.target.value);
  };

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <>
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
            <Button color="inherit" size="small">
              <Select
                slotProps={{
                  input: {
                    sx: {
                      padding: 0,
                    },
                  },
                }}
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
          </>
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

PaidRateChart.protoTypes = {
  sx: PropTypes.object,
};
