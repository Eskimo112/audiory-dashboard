/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Edit,
  ToggleOn,
  ToggleOnOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { formatDateTime, formatNumber } from '@/utils/formatters';

import { toastError, toastSuccess } from '../../../utils/notification';

const CoinPackPage = () => {
  const requestHeader = useRequestHeader();
  const {
    data: coinpacks = [],
    isLoading,
    refetch,
  } = useQuery(
    ['coinpacks'],
    async () => await new CoinPackService(requestHeader).getAll(),
  );
  const [openDialog, setOpenDialog] = useState(false);

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
        accessorFn: (row) => formatDateTime(row.created_date),
      },
      {
        accessorKey: 'updated_date',
        header: 'Ngày cập nhật',
        size: 75,
        accessorFn: (row) => formatDateTime(row.created_date),
      },
      {
        accessorKey: 'deleted_date',
        header: 'Trạng thái',
        size: 80,
        accessorFn: (row) => {
          return row.deleted_date ? 'Vô hiệu hóa' : 'Kích hoạt';
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

  const handleDeactivate = async (coinpack) => {
    try {
      if (coinpack?.deleted_date) {
        await new CoinPackService(requestHeader).activateById(coinpack.id);
        toastSuccess('Đã kích hoạt thành công');
      } else {
        await new CoinPackService(requestHeader).deactivateById(coinpack.id);
        toastSuccess('Đã vô hiệu hóa thành công');
      }
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    refetch();
    setOpenDialog(false);
  };

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
                  sx={{
                    color: row.original?.deleted_date
                      ? 'success.main'
                      : 'error.main',
                  }}
                  onClick={() => {
                    setOpenDialog(true);
                  }}>
                  <Dialog
                    open={openDialog}
                    onClose={(e) => {
                      e.stopPropagation();
                      setOpenDialog(false);
                    }}
                    PaperProps={{
                      sx: {
                        p: 1,
                        width: '400px',
                      },
                    }}>
                    <DialogTitle>
                      Bạn có chắc chắn{' '}
                      {!row.original?.deleted_date
                        ? ' vô hiệu hóa'
                        : 'kích hoạt'}{' '}
                      gói xu này?
                    </DialogTitle>
                    <DialogContent></DialogContent>
                    <DialogActions>
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDialog(false);
                        }}>
                        Hủy bỏ
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleDeactivate(row.original)}
                        autoFocus>
                        Xác nhận
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    {!row.original.deleted_date ? (
                      <VisibilityOff />
                    ) : (
                      <ToggleOnOutlined />
                    )}
                  </SvgIcon>
                  {!row.original.deleted_date ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
