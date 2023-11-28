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
import LevelService from '@/services/level';
import { formatDateTime } from '@/utils/formatters';
import { toastError } from '@/utils/notification';

const LevelPage = () => {
  const requestHeader = useRequestHeader();
  const {
    data: authorLevels = [],
    isLoading: authorLoading,
    refetch: refetchAuthor,
  } = useQuery(
    ['author-levels'],
    async () => await new LevelService(requestHeader).getAllAuthor(),
  );
  const { data: readerLevels = [], isLoading: readerLoading } = useQuery(
    ['reader-levels'],
    async () => await new LevelService(requestHeader).getAllReader(),
  );
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();

  const authorColumns = useMemo(
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
        size: 80,
      },
      {
        accessorKey: 'min_stories',
        header: 'Truyện',
        size: 80,
      },
      {
        accessorKey: 'min_reads',
        header: 'Lượt đọc',
        size: 80,
      },
      {
        accessorKey: 'min_votes',
        header: 'Bình chọn',
        size: 80,
      },
      {
        accessorKey: 'min_comments',
        header: 'Bình luận',
        size: 80,
      },
      {
        accessorKey: 'min_donations',
        header: 'Ủng hộ',
        size: 80,
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
  const readerColumns = useMemo(
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
        size: 250,
      },
      {
        accessorKey: 'name',
        header: 'Tên',
        size: 250,
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

  const handleDelete = async (level) => {
    try {
      await new LevelService(requestHeader).deleteAuthorLevel(level.id);
      toastError('Xóa thành công');
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    refetchAuthor();
    setOpenDialog(false);
  };

  const authorInitialState = {
    columnVisibility: {
      id: false,
      created_date: false,
      updated_date: false,
    },
    showGlobalFilter: true,
  };

  if (readerLoading || authorLoading)
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
        <title>Cấp | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack gap="40px">
            <Stack spacing={1}>
              <Typography variant="h4">Quản lý cấp</Typography>
            </Stack>
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4" fontSize="24px">
                    Cấp tác giả
                  </Typography>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}></Stack>
                </Stack>
                <div>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={() => router.push('/admin/levels/author/create')}>
                    Thêm cấp tác giả
                  </Button>
                </div>
              </Stack>

              <MaterialReactTable
                renderRowActionMenuItems={({ closeMenu, row, table }) => [
                  <MenuItem
                    key="edit"
                    onClick={() => {
                      router.push(`/admin/levels/author/${row.original.id}`);
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
                      <DialogTitle>Bạn có chắc chắn xóa cấp này?</DialogTitle>
                      <DialogContent></DialogContent>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenDialog(false)}>
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
                      {!row.original.deleted_date ? (
                        <VisibilityOff />
                      ) : (
                        <ToggleOnOutlined />
                      )}
                    </SvgIcon>
                    Xóa
                  </MenuItem>,
                ]}
                columns={authorColumns}
                data={authorLevels}
                initialState={authorInitialState}
                {...SHARED_TABLE_PROPS}
              />
            </Stack>

            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4" fontSize="24px">
                    Quản lý cấp độc giả
                  </Typography>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}></Stack>
                </Stack>
                <div>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={() => router.push('/admin/levels/create')}>
                    Thêm cấp độc giả
                  </Button>
                </div>
              </Stack>

              <MaterialReactTable
                renderRowActionMenuItems={({ closeMenu, row, table }) => [
                  <MenuItem
                    key="edit"
                    onClick={() => {
                      router.push(`/admin/levels/${row.original.id}`);
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
                        cấp này?
                      </DialogTitle>
                      <DialogContent></DialogContent>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenDialog(false)}>
                          Hủy bỏ
                        </Button>
                        {/* <Button
                        variant="contained"
                        onClick={() => handleDelete(row.original)}
                        autoFocus>
                        Xác nhận
                      </Button> */}
                      </DialogActions>
                    </Dialog>
                    <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                      {!row.original.deleted_date ? (
                        <VisibilityOff />
                      ) : (
                        <ToggleOnOutlined />
                      )}
                    </SvgIcon>
                    Xóa
                  </MenuItem>,
                ]}
                columns={readerColumns}
                data={readerLevels}
                initialState={authorInitialState}
                {...SHARED_TABLE_PROPS}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default LevelPage;
