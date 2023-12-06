import { useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { DeleteOutline, Edit } from '@mui/icons-material';
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

import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { STATUS_MAP } from '@/constants/status_map';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import CategoryService from '@/services/category';
import { formatDateTime } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

const CategoryPage = () => {
  const requestHeader = useRequestHeader();
  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery(
    ['category'],
    async () => await new CategoryService(requestHeader).getAll(),
  );

  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async (category) => {
    try {
      await new CategoryService(requestHeader).deleteById(category.id);
      toastSuccess('Xóa thành công');
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    refetch();
    setOpenDialog(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'order',
        header: 'STT',
        size: 20,
        accessorFn: (_, index) => {
          return index + 1;
        },
        enableColumnActions: false,
      },
      {
        accessorKey: 'id',
        header: 'Id',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Tên',
        size: 120,
      },
      {
        accessorKey: 'image_url',
        header: 'Ảnh',
        Cell: ({ cell }) => {
          return (
            <Box display="flex" alignItems="center">
              <Box
                component="img"
                src={cell.getValue()}
                alt={cell.getValue()}
                width={90}
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
        accessorKey: 'is_enabled',
        header: 'Trạng thái',
        size: 80,
        accessorFn: (row) => {
          if (!row.is_enabled) return 'Không xác định';
          return STATUS_MAP[row.is_enabled];
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
        <title>Thể loại | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Quản lý thể loại</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  onClick={() => {
                    router.push('/admin/categories/create');
                  }}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained">
                  Thêm thể loại
                </Button>
              </div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="edit"
                  onClick={() => {
                    router.push(`/admin/categories/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Edit />
                  </SvgIcon>
                  Chỉnh sửa
                </MenuItem>,
                <MenuItem
                  key="delete"
                  sx={{
                    color: 'error.main',
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
                      Bạn có chắc chắn xóa thể loại này?
                    </DialogTitle>
                    <DialogActions>
                      <Button
                        variant="outlined"
                        onClose={(e) => {
                          e.stopPropagation();
                          setOpenDialog(false);
                        }}>
                        Hủy bỏ
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(row.original)}
                        autoFocus>
                        Xác nhận
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <DeleteOutline />
                  </SvgIcon>
                  Xóa thể loại
                </MenuItem>,
              ]}
              columns={columns}
              data={categories}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default CategoryPage;
