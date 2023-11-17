import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { Box, Button, Chip, CircularProgress } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '@/constants/chip_colors';
import {
  TRANSACTION_STATUS_MAP,
  TRANSACTION_TYPE_MAP,
} from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';
import { formatDate } from '@/utils/formatters';

const UserTransactionsTable = ({ userId }) => {
  const requestHeader = useRequestHeader();
  const { data: transactions = [], isLoading } = useQuery(
    ['user', userId, 'transactions'],
    async () =>
      await new UserService(requestHeader).getTransactionsByUserId(userId),
    { enabled: Boolean(userId), retry: false },
  );

  const router = useRouter();

  const columns = useMemo(
    () => [
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
        accessorKey: 'coin.value',
        header: 'Số lượng',
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
    columnVisibility: {},
    showGlobalFilter: true,
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
      <MaterialReactTable
        columns={columns}
        data={transactions}
        initialState={initialState}
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
        // displayColumnDefOptions={{
        //   'mrt-row-actions': { header: '', size: 150 },
        // }}
        // renderRowActions={({ row }) => {
        //   return (
        //     <Button
        //       sx={{
        //         borderRadius: 4,
        //         padding: '4px 8px',
        //         fontSize: '12px',
        //       }}
        //       variant="outlined"
        //       onClick={() => {
        //         router.push(`/transaction/${row.original.id}`);
        //       }}>
        //       Xem chi tiết
        //     </Button>
        //   );
        // }}
      />
    </>
  );
};

export default UserTransactionsTable;
