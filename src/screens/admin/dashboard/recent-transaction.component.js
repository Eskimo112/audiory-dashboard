import { useMemo } from 'react';

import { useRouter } from 'next/router';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
// eslint-disable-next-line no-unused-vars
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '@/constants/chip_colors';
import { TRANSACTION_TYPE_MAP } from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import { countDiffenceFromNow, formatDateTime } from '@/utils/formatters';

import TransactionService from '../../../services/transaction';

const RecentTransactionsTable = () => {
  const requestHeader = useRequestHeader();
  const {
    data: transactions,
    isLoading,
    refetch,
  } = useQuery(
    ['transactions'],
    async () => await new TransactionService(requestHeader).getAll(),
  );

  const router = useRouter();

  const columns = useMemo(
    () => [
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
        accessorKey: 'coin_value',
        header: 'Giá trị',
        size: 80,
        Cell: ({ cell, row }) => {
          return (
            <Box display="flex" alignItems="center" gap="4px">
              {cell.getValue()}
              <Box
                component="img"
                src={row.original.coin.image_url}
                width={20}
                height={20}></Box>
            </Box>
          );
        },
      },
      {
        accessorKey: 'created_date',
        header: 'Thời gian',
        accessorFn: (row) => {
          return formatDateTime(row.created_date);
        },
      },
    ],
    [router],
  );

  const initialState = {
    columnVisibility: {},
    showGlobalFilter: true,
    pagination: {
      pageSize: 5,
    },
  };

  //   if (isError) {
  //     return (
  //       <Box width="100%" display="flex" justifyContent="center">
  //         <Typography>Đã có lỗi xảy ra, thử lại sau</Typography>;
  //       </Box>
  //     );
  //   }

  if (isLoading)
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Card sx={{ p: 2 }}>
        <CardHeader
          action={
            <Stack direction="row" gap="8px">
              <Button
                color="inherit"
                size="small"
                onClick={() => refetch()}
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowPathIcon />
                  </SvgIcon>
                }>
                Làm mới
              </Button>
            </Stack>
          }
          title="Truyện nổi tiếng"
        />
        <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <MaterialReactTable
            columns={columns}
            data={transactions}
            initialState={initialState}
            muiPaginationProps={{
              rowsPerPageOptions: [],
              showFirstButton: false,
              showLastButton: false,
            }}
            {...SHARED_TABLE_PROPS}
            muiTableHeadCellProps={{
              sx: {
                height: '48px!important',
                fontSize: '14px!important',
              },
            }}
            muiTopToolbarProps={{
              sx: {
                display: 'none',
              },
            }}
            enableRowActions={false}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default RecentTransactionsTable;
