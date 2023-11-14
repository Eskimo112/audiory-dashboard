/* eslint-disable no-unused-vars */
import { useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { STATUS_MAP } from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import CoinPackService from '@/services/coinpack';
import { formatDate, formatNumber } from '@/utils/formatters';

const CoinPackPage = () => {
  const requestHeader = useRequestHeader();
  const { data: coinpacks, isLoading } = useQuery(
    ['coinpacks'],
    async () => await new CoinPackService(requestHeader).getAll(),
  );

  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 150,
      },

      {
        accessorKey: 'name',
        header: 'Tên',
      },
      {
        accessorKey: 'coin_amount',
        header: 'Số xu',
      },
      {
        accessorKey: 'price',
        header: 'Giá',
        accessorFn: (row) => formatNumber(row.price),
      },
      // {
      //   accessorKey: 'coin_id',
      //   header: 'Id xu',
      // },
      {
        accessorKey: 'image_url',
        header: 'Ảnh',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return;
          return (
            <Box display="flex" alignItems="center">
              <Box
                component="img"
                src={cell.getValue()}
                alt={cell.getValue()}
                width={40}
                height={40}></Box>
            </Box>
          );
        },
      },
      {
        accessorKey: 'created_date',
        header: 'Ngày tạo',
        size: 75,
        accessorFn: (row) => formatDate(row.created_date),
      },
      {
        accessorKey: 'updated_date',
        header: 'Ngày cập nhật',
        size: 75,
        accessorFn: (row) => formatDate(row.created_date),
      },
      {
        accessorKey: 'is_enabled',
        header: 'Trạng thái',
        size: 80,
        accessorFn: (row) => {
          return STATUS_MAP[row.is_enabled ?? true];
        },
        filterFn: 'equals',
        filterSelectOptions: Object.values(STATUS_MAP).map((value) => ({
          text: value,
          value,
        })),
        filterVariant: 'select',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return <></>;
          const bgColor = ['success.alpha20', 'error.alpha20'];
          const idx = Object.values(STATUS_MAP).indexOf(cell.getValue());
          return (
            <Chip
              label={cell.getValue()}
              sx={{
                backgroundColor: bgColor[idx],
              }}
            />
          );
        },
      },
    ],
    [],
  );

  const initialState = {
    columnVisibility: {
      id: false,
      created_date: false,
      updated_date: false,
    },
    showGlobalFilter: true,
  };

  if (isLoading)
    return (
      <Card
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <CircularProgress />
      </Card>
    );

  return (
    <>
      <Head>
        <title>Gói xu | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Quản lý gói xu</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push('/admin/coinpacks/create')}>
                  Thêm gói xu
                </Button>
              </div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="edit"
                  onClick={() => {
                    router.push(`/admin/coinpacks/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Edit />
                  </SvgIcon>
                  Chỉnh sửa
                </MenuItem>,
                <MenuItem
                  key="deactiviate"
                  sx={{ color: 'error.main' }}
                  onClick={() => {
                    router.push(`/admin/coinpacks/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <VisibilityOff />
                  </SvgIcon>
                  Vô hiệu hóa
                </MenuItem>,
              ]}
              columns={columns}
              data={coinpacks}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default CoinPackPage;