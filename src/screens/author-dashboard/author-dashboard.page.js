import Head from 'next/head';

import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';

import { AuthorRevenueChart } from './author-revenue-chart';
import AuthorStatCards from './author-stat-card';
import ReaderRankingTable from './reader-ranking-table';
import ReaderTransactionsTable from './reader-transaction-table';
import { TopStoriesChart } from './top-stories-chart';

const AuthorDashboardPage = () => {
  return (
    <>
      <Head>
        <title>Thống kê | Audiory</title>
      </Head>
      <Box
        component="main"
        sx={{
          ...SHARED_PAGE_SX,
          // background: '#93DBD8',
          // background: 'radial-gradient(at center, #C6E9EE, #FFFFFF)',
        }}>
        <Container
          sx={{
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
          <Stack
            sx={{
              marginY: 4,
              fontStyle: 'italic',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Typography variant="h4">Tổng quan số liệu</Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid xs={12} lg={6}>
              <AuthorRevenueChart />
            </Grid>

            <Grid xs={12} lg={6} container spacing={3}>
              <AuthorStatCards />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid xs={12} lg={6}>
              <ReaderRankingTable />
            </Grid>
            <Grid xs={12} lg={6}>
              <TopStoriesChart />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid xs={12} lg={12}>
              <ReaderTransactionsTable />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AuthorDashboardPage;
