import Head from 'next/head';

import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';

import { StatCard } from './card.component';
import { CategoryChart } from './category-chart.component';
import { PaidRateChart } from './paid-chart.component';
import { RevenueChart } from './revenue-chart.component';

const DashboardPage = () => (
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
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} lg={3}>
            <StatCard
              value={204340}
              title="Tổng người dùng"
              difference={30}
              icon={<ShoppingBagIcon />}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <StatCard
              value={204340}
              title="Tổng người dùng"
              difference={30}
              icon={<ShoppingBagIcon />}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <StatCard
              value={204340}
              title="Tổng người dùng"
              difference={30}
              icon={<ShoppingBagIcon />}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <StatCard
              value={204340}
              title="Tổng người dùng"
              difference={30}
              icon={<ShoppingBagIcon />}
            />
          </Grid>
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

export default DashboardPage;
