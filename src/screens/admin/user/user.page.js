import { useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  ToggleOnOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Avatar,
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
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';
import { formatDateTime } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

import { STATUS_MAP } from '../../../constants/status_map';

const ROLE_ID_MAP = {
  1: 'Người dùng',
  2: 'Quản trị viên',
};

const UserPage = () => {
  const requestHeader = useRequestHeader();
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery(
    ['users'],
    async () => await new UserService(requestHeader).getAll(),
  );

  const [openDialog, setOpenDialog] = useState();

  const handleDeactivate = async (user) => {
    try {
      if (user?.deleted_date) {
        await new UserService(requestHeader).activateById(user.id);
        toastSuccess('Đã kích hoạt thành thành công');
      } else {
        await new UserService(requestHeader).deactivateById(user.id);
        toastSuccess('Đã vô hiệu hóa thành công');
      }
      refetch();
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    setOpenDialog(false);
  };

  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
      },
      {
        accessorKey: 'full_name',
        header: 'Thông tin',
        Cell: (cell) => {
          const user = cell.row.original;
          return (
            <Stack
              alignItems="center"
              // justifyContent="center"
              direction="row"
              spacing={2}>
              <Avatar src={user.avatar_url} width={50} height={50}></Avatar>
              <Stack alignItems="start">
                <Typography variant="subtitle2">
                  {user.full_name ?? 'Không có tên'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontStyle="italic"
                  color="ink.lighter">
                  {user.username ?? 'Không có username'}
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'email', // access nested data with dot notation
        header: 'Email',
      },
      {
        accessorKey: 'role_id',
        header: 'Vai trò',
        accessorFn: (row) => {
          if (!row.role_id) return 'Người dùng';
          return ROLE_ID_MAP[row.role_id];
        },
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Người dùng', value: 'Người dùng' },
          {
            text: 'Quản trị viên',
            value: 'Quản trị viên',
          },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return <></>;
          return (
            <Chip
              label={cell.getValue()}
              sx={{
                backgroundColor:
                  cell.getValue() === 'Người dùng'
                    ? 'success.alpha20'
                    : 'error.alpha20',
              }}
            />
          );
        },
      },
      {
        accessorKey: 'created_date',
        header: 'Ngày tạo',
        accessorFn: (row) => formatDateTime(row.created_date),
        // Cell: ({ cell }) => <Chip label={cell.getValue()} />,
      },
      {
        accessorKey: 'is_online',
        header: 'Trạng thái',
        size: 80,
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Online', value: true },
          { text: 'Offline', value: false },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? 'Online' : 'Offline'}
            sx={{
              backgroundColor: cell.getValue()
                ? 'success.alpha20'
                : 'error.alpha20',
            }}
          />
        ),
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
      email: false,
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
        <title>Người dùng | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Người dùng</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              {/* <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained">
                Thêm người dùng
              </Button> */}
            </Stack>
            <MaterialReactTable
              columns={columns}
              data={users}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="show"
                  onClick={() => {
                    router.push(`/admin/users/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Visibility />
                  </SvgIcon>
                  Xem chi tiết
                </MenuItem>,
                // <MenuItem
                //   key="edit"
                //   onClick={() => {
                //     router.push(`/admin/stories/${row.original.id}`);
                //   }}>
                //   <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                //     <Edit />
                //   </SvgIcon>
                //   Chỉnh sửa
                // </MenuItem>,
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
                      người dùng này?
                    </DialogTitle>
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default UserPage;
