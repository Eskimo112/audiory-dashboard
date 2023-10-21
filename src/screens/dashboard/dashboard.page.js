import Head from 'next/head';

import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import GlobeAltIcon from '@heroicons/react/24/outline/GlobeAltIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import {
  Box,
  CircularProgress,
  Container,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import DashboardService from '../../services/dashboard';
import { StatCard } from './card.component';
import { CategoryChart } from './category-chart.component';
import { PaidRateChart } from './paid-chart.component';
import { RevenueChart } from './revenue-chart.component';

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery(['dashboard', 'stat'], () =>
    DashboardService.getStat(),
  );

  return (
    <>
      <Head>
        <title>Dashboard | Audiory</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}>
        <Container maxWidth="xl">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} lg={3}>
                <StatCard
                  value={stats.total_users}
                  title="Tổng người dùng"
                  difference={30}
                  icon={<UserGroupIcon />}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <StatCard
                  value={stats.total_online_users}
                  title="Người dùng đang online"
                  difference={30}
                  icon={<GlobeAltIcon />}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <StatCard
                  value={stats.total_stories}
                  title="Tổng truyện"
                  difference={30}
                  icon={<BookOpenIcon />}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <StatCard
                  value={stats.total_revenue}
                  title="Tổng doanh thu"
                  difference={30}
                  icon={<CurrencyDollarIcon />}
                />
              </Grid>
            </Grid>
          )}
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
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
