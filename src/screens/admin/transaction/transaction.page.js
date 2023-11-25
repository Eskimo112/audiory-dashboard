import { useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Avatar,
  Box,
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

import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '@/constants/chip_colors';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import {
  TRANSACTION_STATUS_MAP,
  TRANSACTION_TYPE_MAP,
} from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import TransactionService from '@/services/transaction';
import { formatDate } from '@/utils/formatters';

const TransactionPage = () => {
  const requestHeader = useRequestHeader();
  const { data: transactions, isLoading } = useQuery(
    ['transaction'],
    async () => await new TransactionService(requestHeader).getAll(),
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
        accessorKey: 'user',
        header: 'Người dùng',
        Cell: ({ row }) => {
          if (!row.original.user) return;
          return (
            <Stack
              alignItems="center"
              direction={'row'}
              spacing={1}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                router.push(`/admin/users/${row.original.user.id}`);
              }}>
              <Avatar
                src={row.original.user.avatar_url}
                sx={{ width: '40px', height: '40px' }}></Avatar>
              <Stack alignItems="start">
                <Typography variant="subtitle2">
                  {row.original.user.full_name ?? 'Không có tên'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontStyle="italic"
                  color="ink.lighter">
                  {row.original.user.username ?? 'Không có username'}
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'transaction_type',
        header: 'Loại giao dịch',
        size: 80,
        accessorFn: (row) => {
          if (!row.transaction_type) return 'Không xác định';
          return TRANSACTION_TYPE_MAP[row.transaction_type];
        },
        filterFn: 'equals',
        filterSelectOptions: Object.values(TRANSACTION_TYPE_MAP).map(
          (value) => ({
            text: value,
            value,
          }),
        ),
        filterVariant: 'select',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return <></>;
          const idx = Object.values(TRANSACTION_TYPE_MAP).indexOf(
            cell.getValue(),
          );
          return (
            <Chip
              label={cell.getValue()}
              sx={{
                backgroundColor: CHIP_BG_COLORS[idx],
                color: CHIP_FONT_COLORS[idx],
              }}
            />
          );
        },
      },
      {
        accessorKey: 'coin.image_url',
        header: 'Loại xu',
        size: 80,
        Cell: ({ cell }) => {
          return (
            <Box display="flex" alignItems="center">
              <Box
                component="img"
                src={cell.getValue()}
                alt={cell.getValue()}
                width={30}
                height={30}></Box>
            </Box>
          );
        },
      },
      {
        accessorKey: 'coin_value',
        header: 'Giá trị',
        size: 80,
      },
      {
        accessorKey: 'created_date',
        header: 'Ngày tạo',
        accessorFn: (row) => formatDate(row.created_date),
      },
      {
        accessorKey: 'transaction_status',
        header: 'Trạng thái',
        size: 80,
        accessorFn: (row) => {
          if (!row.transaction_status) return 'Không xác định';
          return TRANSACTION_STATUS_MAP[row.transaction_status];
        },
        filterFn: 'equals',
        filterSelectOptions: Object.values(TRANSACTION_STATUS_MAP).map(
          (value) => ({
            text: value,
            value,
          }),
        ),
        filterVariant: 'select',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return <></>;
          const idx = Object.values(TRANSACTION_STATUS_MAP).indexOf(
            cell.getValue(),
          );
          return (
            <Chip
              label={cell.getValue()}
              sx={{
                backgroundColor: CHIP_BG_COLORS[idx],
                color: CHIP_FONT_COLORS[idx],
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
          height: '500px',
        }}>
        <CircularProgress />
      </Card>
    );

  return (
    <>
      <Head>
        <title>Giao dịch | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Quản lý giao dịch</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div></div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="show"
                  onClick={() => {
                    router.push(`/admin/system-configs/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Visibility />
                  </SvgIcon>
                  Lịch sử thay đổi
                </MenuItem>,
                <MenuItem
                  key="edit"
                  onClick={() => {
                    router.push(`/admin/system-configs/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <VisibilityOff />
                  </SvgIcon>
                  Vô hiệu hóa
                </MenuItem>,
              ]}
              columns={columns}
              data={transactions}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
              enableRowActions={false}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default TransactionPage;
