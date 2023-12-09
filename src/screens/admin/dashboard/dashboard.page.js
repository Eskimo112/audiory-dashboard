import Head from 'next/head';

import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import GlobeAltIcon from '@heroicons/react/24/outline/GlobeAltIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { useQuery } from 'react-query';

import { SHARED_PAGE_SX } from '@/constants/page_sx';
import DashboardService from '@/services/dashboard';

import { useRequestHeader } from '../../../hooks/use-request-header';
import { CategoryChart } from './category-chart.component';
import { PaidRateChart } from './paid-chart.component';
import RecentTransactionsTable from './recent-transaction.component';
import { RevenueChart } from './revenue-chart.component';
import { StatCard } from './stat-card.component';
import TopStoriesTable from './top-stories.component';

const DashboardPage = () => {
  const requestHeader = useRequestHeader();
  const {
    data: stats = {},
    isLoading,
    isError,
  } = useQuery(
    ['dashboard', 'stat'],
    () => new DashboardService(requestHeader).getStat(),
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  return (
    <>
      <Head>
        <title>Dashboard | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <StatCard
                isLoading={isLoading}
                isError={isError}
                value={stats.total_users}
                title="Tổng người dùng"
                icon={<UserGroupIcon />}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <StatCard
                isLoading={isLoading}
                isError={isError}
                value={stats.total_online_users}
                title="Người dùng online"
                icon={<GlobeAltIcon />}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <StatCard
                isLoading={isLoading}
                isError={isError}
                value={stats.total_stories}
                title="Tổng truyện"
                icon={<BookOpenIcon />}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <StatCard
                isLoading={isLoading}
                isError={isError}
                value={stats.total_revenue}
                title="Tổng doanh thu"
                icon={<CurrencyDollarIcon />}
                suffix={'₫'}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid xs={12} lg={12}>
              <RevenueChart />
            </Grid>
            <Grid xs={12} md={10} lg={8}>
              <CategoryChart />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <PaidRateChart />
            </Grid>
            <Grid xs={12} md={6} lg={6}>
              <TopStoriesTable />
            </Grid>
            <Grid xs={12} md={6} lg={6}>
              <RecentTransactionsTable />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
