import { useMemo, useState } from 'react';

import Head from 'next/head';

import { DatePicker } from '@mantine/dates';
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';

import { SHARED_TABLE_PROPS } from '../../../constants/table';
import SystemConfigService from '../../../services/system-config';
import { formatDate } from '../../../utils/formatters';

const SystemConfigDetailPage = ({ configId }) => {
  const requestHeader = useRequestHeader();
  const { data: config = {}, isLoading: configLoading } = useQuery(
    ['system-configs', configId],
    async () => await new SystemConfigService(requestHeader).getById(configId),
  );
  const [value, setValue] = useState();
  const { data: configHistory = [], isLoading } = useQuery(
    ['system-configs', 'next-effective', configId],
    async () =>
      await new SystemConfigService(requestHeader).getNextEffectiveById(
        configId,
      ),
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
      },
      {
        accessorKey: 'position',
        header: 'Thứ tự',
        size: 10,
        enableColumnActions: false,
      },
      {
        accessorKey: 'title',
        header: 'Tiêu đề',
        size: 250,
      },
      {
        accessorKey: 'is_draft',
        header: 'Trạng thái',
        accessorFn: (row) => (row.is_draft ? 'Viết nháp' : 'Đã xuất bản'),
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Đã xuất bản', value: 'Đã xuất bản' },
          { text: 'Viết nháp', value: 'Viết nháp' },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            sx={{
              backgroundColor:
                cell.getValue() === 'Viết nháp'
                  ? 'success.alpha20'
                  : 'error.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'is_paywalled',
        header: 'Tính phí',
        accessorFn: (row) => (row.is_paywalled ? 'Tính phí' : 'Miễn phí'),

        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Tính phí', value: 'Tính phí' },
          { text: 'Miễn phí', value: 'Miễn phí' },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            sx={{
              backgroundColor:
                cell.getValue() === 'Miễn phí'
                  ? 'error.alpha20'
                  : 'success.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'updated_date',
        header: 'Ngày cập nhật',
        accessorFn: (row) => formatDate(row.updated_date).slice(0, 10),
      },
    ],
    [],
  );

  const initialState = {
    columnVisibility: {
      id: false,
    },
    showGlobalFilter: true,
  };

  if (isLoading) return <CircularProgress />;
  return (
    <>
      <Head>
        <title>Thông số {config?.key} </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
              alignItems="flex-end"
              px="16px">
              <Stack spacing={1}>
                <Typography variant="h4">{config?.key}</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={configHistory?.title} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content"></Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={12}>
                <Stack>
                  <TextField
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <DatePicker />
                  <DatePicker />
                </Stack>
              </Grid>
              <Grid xs={12} lg={12}>
                <MaterialReactTable
                  {...SHARED_TABLE_PROPS}
                  columns={columns}
                  data={configHistory}
                  initialState={initialState}
                  muiTopToolbarProps={{
                    sx: {
                      display: 'none',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default SystemConfigDetailPage;
