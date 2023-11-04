import { useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
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

import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '../../constants/chip_colors';
import { SHARED_PAGE_SX } from '../../constants/page_sx';
import {
  TRANSACTION_STATUS_MAP,
  TRANSACTION_TYPE_MAP,
} from '../../constants/status_map';
import { SHARED_TABLE_PROPS } from '../../constants/table';
import TransactionService from '../../services/transaction';
import { formatDate } from '../../utils/formatters';
import UserInfo from '../report/user-info.component';

const TransactionPage = () => {
  const { data: transactions, isLoading } = useQuery(
    ['transaction'],
    async () => await TransactionService.getAll(),
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
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained">
                  Thêm giao dịch
                </Button>
              </div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="edit"
                  onClick={() => {
                    router.push(`/tranactions/${row.original.id}`);
                  }}>
                  Chỉnh sửa
                </MenuItem>,
                <MenuItem key="delete" onClick={() => console.info('Delete')}>
                  Vô hiệu hóa
                </MenuItem>,
              ]}
              columns={columns}
              data={transactions}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default TransactionPage;
