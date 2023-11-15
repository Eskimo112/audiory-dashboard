import { useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';
import { formatDate } from '@/utils/formatters';

const ROLE_ID_MAP = {
  1: 'Người dùng',
  2: 'Quản trị viên',
};

const UserPage = () => {
  const requestHeader = useRequestHeader();
  const { data: users, isLoading } = useQuery(
    ['users'],
    async () => await new UserService(requestHeader).getAll(),
  );

  // const filteredUsers = (users ?? []).filter((user) => !!user.role_id);

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
        accessorFn: (row) => formatDate(row.created_date),
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
        <title>Users | Audiory</title>
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
              // renderRowActionMenuItems={({ closeMenu, row, table }) => [
              //   <MenuItem
              //     key="edit"
              //     onClick={() => {
              //       router.push(`/users/${row.original.id}`);
              //     }}>
              //     Chỉnh sửa
              //   </MenuItem>,
              //   <MenuItem key="delete" onClick={() => console.info('Delete')}>
              //     Vô hiệu hóa
              //   </MenuItem>,
              // ]}
              columns={columns}
              data={users}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
              displayColumnDefOptions={{
                'mrt-row-actions': { header: '', size: 150 },
              }}
              renderRowActions={({ row }) => {
                return (
                  <Button
                    sx={{
                      borderRadius: 4,
                      padding: '5px 12px',
                    }}
                    variant="outlined"
                    onClick={() => {
                      router.push(`users/${row.original.id}`);
                    }}>
                    Xem chi tiết
                  </Button>
                );
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default UserPage;
