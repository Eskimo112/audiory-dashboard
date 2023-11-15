import { useState } from 'react';

import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import GlobeAltIcon from '@heroicons/react/24/outline/GlobeAltIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {
  Button,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';
import AuthorDashboardService from '@/services/author-dashboard';
import { getPastDates, getRecentDates } from '@/utils/get-recent-dates';
import { toastError } from '@/utils/notification';

import { SHARED_SELECT_PROPS, TIME_OPTIONS } from '../admin/dashboard/constant';
import { StatCard } from '../admin/dashboard/stat-card.component';

const AuthorStatCards = () => {
  const requestHeader = useRequestHeader();
  const authorDashboardService = new AuthorDashboardService(requestHeader);
  const [option, setOption] = useState('7_recent_days');
  const [dates, setDates] = useState(getRecentDates(7));
  const {
    data: stats = { current: {}, past: {} },
    isLoading,
    isRefetching,
    error,
    isError,
    refetch,
  } = useQuery(
    ['author', 'dashboard', 'stat', dates[0], dates[1]],
    async () => {
      const response = await authorDashboardService.getStat(dates[0], dates[1]);
      const pastDates = getPastDates(dates[0], dates[1]);
      const pastResponse = await authorDashboardService.getStat(
        pastDates[0],
        pastDates[1],
      );
      console.log(response);
      console.log(pastResponse);
      return { current: response, past: pastResponse };
    },
  );

  if (isError) {
    if (!error.response.data.message) toastError(error.toString());
    else toastError(error.response.data.message);
  }

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
    <>
      <Grid xs={12} display="flex" justifyContent="flex-end">
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
      </Grid>

      <Grid xs={6} display="flex" gap="16px" flexDirection="column">
        <StatCard
          isLoading={isLoading || isRefetching}
          isError={isError}
          value={stats.current.total_comment}
          title="Bình luận mới"
          difference={stats.current.total_comment - stats.past.total_comment}
          icon={<UserGroupIcon />}
        />
        <StatCard
          isLoading={isLoading || isRefetching}
          isError={isError}
          value={stats.current.total_donation}
          title="Lượt tặng quà"
          difference={stats.current.total_donation - stats.past.total_donation}
          icon={<GlobeAltIcon />}
        />
      </Grid>
      <Grid xs={6} display="flex" gap="16px" flexDirection="column">
        <StatCard
          isLoading={isLoading || isRefetching}
          isError={isError}
          value={stats.current.total_read}
          title="Lượt đọc mới"
          difference={stats.current.total_read - stats.past.total_read}
          icon={<BookOpenIcon />}
        />
        <StatCard
          isLoading={isLoading || isRefetching}
          isError={isError}
          value={stats.current.total_vote}
          title="Bình chọn mới"
          difference={stats.current.total_vote - stats.past.total_vote}
          icon={<CurrencyDollarIcon />}
        />
      </Grid>
    </>
  );
};

export default AuthorStatCards;
