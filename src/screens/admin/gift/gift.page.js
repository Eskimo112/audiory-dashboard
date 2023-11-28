import { useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Edit, ToggleOnOutlined, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { AppLottie } from '@/components/app-lottie';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { STATUS_MAP } from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import GiftService from '@/services/gift';
import { formatDateTime } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

const GiftPage = () => {
  const requestHeader = useRequestHeader();

  const {
    data: gifts,
    isLoading,
    refetch,
  } = useQuery(
    ['gift'],
    async () => await new GiftService(requestHeader).getAll(),
  );
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeactivate = async (coinpack) => {
    try {
      if (coinpack?.deleted_date) {
        await new GiftService(requestHeader).activateById(coinpack.id);
        toastSuccess('Đã kích hoạt thành công');
      } else {
        await new GiftService(requestHeader).deactivateById(coinpack.id);
        toastSuccess('Đã vô hiệu hóa thành công');
      }
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    refetch();
    setOpenDialog(false);
  };

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
        accessorKey: 'price',
        header: 'Giá',
      },
      {
        accessorKey: 'image_url',
        header: 'Ảnh',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return;
          return (
            <Box display="flex" alignItems="center">
              <AppLottie
                url={cell.getValue()}
                width={50}
                height={50}></AppLottie>
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
          height: '500px',
        }}>
        <CircularProgress />
      </Card>
    );

  return (
    <>
      <Head>
        <title>Quà | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Quản lý quà</Typography>
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
                  Thêm quà
                </Button>
              </div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => {
                return [
                  <MenuItem
                    key="edit"
                    onClick={() => {
                      router.push(`/admin/gifts/${row.original.id}`);
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
                      onClose={() => setOpenDialog(false)}
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
                        quà này?
                      </DialogTitle>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenDialog(false)}>
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
                ];
              }}
              columns={columns}
              data={gifts}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default GiftPage;
