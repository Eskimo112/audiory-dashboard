import React, { useMemo } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '@/constants/chip_colors';
import {
  TRANSACTION_STATUS_MAP,
  TRANSACTION_TYPE_MAP,
} from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import AuthorDashboardService from '@/services/author-dashboard';
import { timeAgo } from '@/utils/formatters';

import UserInfo from '../admin/report/user-info.component';

const ReaderTransactionsTable = () => {
  const requestHeader = useRequestHeader();
  const { data: transactions = [], isLoading } = useQuery(
    ['author', 'reader-tranactions'],
    () =>
      new AuthorDashboardService(requestHeader).getReaderTransactions(
        1,
        Number.MAX_SAFE_INTEGER,
      ),
    { retryOnMount: false, refetchOnMount: false, refetchOnWindowFocus: false },
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 150,
      },
      {
        accessorKey: 'user',
        header: 'Độc giả',
        Cell: ({ row }) => <UserInfo userId={row.original.user_id} />,
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
        accessorFn: (row) => timeAgo(row.created_date),
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
    pagination: { pageIndex: 0, pageSize: 10 },
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader title="Giao dịch độc giả" />
      <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <MaterialReactTable
            {...SHARED_TABLE_PROPS}
            enableRowActions={false}
            columns={columns}
            data={transactions ?? []}
            initialState={initialState}
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
            muiSearchTextFieldProps={{
              placeholder: 'Nhập từ khóa để tìm kiếm',
              sx: { width: '200px', padding: 0 },
              variant: 'outlined',
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReaderTransactionsTable;
