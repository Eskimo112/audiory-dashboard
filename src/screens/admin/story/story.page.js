// eslint-disable-next-line simple-import-sort/imports
import { useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Avatar,
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

import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import StoryService from '@/services/story';
import { Edit, Visibility } from '@mui/icons-material';
import { formatDate } from '../../../utils/formatters';

const StoryPage = () => {
  const { data: stories, isLoading } = useQuery(
    ['stories'],
    async () => await StoryService.getAll(),
  );

  const router = useRouter();

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
        accessorKey: 'cover_url',
        header: 'Ảnh bìa',
        size: 90,
        Cell: ({ cell }) => (
          <Box
            component="img"
            sx={{
              height: 100,
              width: 75,
            }}
            src={cell.getValue().toString()}
          />
        ),
      },
      {
        accessorKey: 'title', // access nested data with dot notation
        header: 'Tên truyện',
        size: 200,
      },
      {
        accessorKey: 'category.name',
        header: 'Thể loại',
      },
      {
        accessorKey: 'author.full_name', // normal accessorKey
        header: 'Tác giả',
        Cell: (cell) => {
          const author = cell.row.original.author;
          return (
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                router.push(`/users/${author.id}`);
              }}>
              <Avatar src={author.avatar_url} width={50} height={50}></Avatar>
              <Stack alignItems="start">
                <Typography variant="subtitle2">
                  {author.full_name ?? 'Không có tên'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontStyle="italic"
                  color="ink.lighter">
                  {author.username ?? 'Không có username'}
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'is_draft',
        header: 'Xuất bản',
        size: 80,
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Bản nháp', value: true },
          { text: 'Xuất bản', value: false },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? 'Bản nháp' : 'Xuất bản'}
            sx={{
              backgroundColor: cell.getValue()
                ? 'error.alpha20'
                : 'success.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'is_mature',
        header: 'Nội dung',
        size: 80,

        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Trưởng thành', value: true },
          { text: 'An toàn', value: false },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? 'Trưởng thành' : 'An toàn'}
            sx={{
              backgroundColor: cell.getValue()
                ? 'error.alpha20'
                : 'success.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'is_completed',
        header: 'Trạng thái',
        size: 80,
        accessorFn: (row) => (row.is_completed ? 'Hoàn thành' : 'Đang ra'),
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Đang ra', value: 'Đang ra' },
          { text: 'Hoàn thành', value: 'Hoàn thành' },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            sx={{
              backgroundColor:
                cell.getValue() === 'Hoàn thành'
                  ? 'success.alpha20'
                  : 'error.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'is_paywalled',
        header: 'Tính phí',
        size: 80,

        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Tính phí', value: true },
          { text: 'Miễn phí', value: false },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? 'Tính phí' : 'Miễn phí'}
            sx={{
              backgroundColor: cell.getValue()
                ? 'error.alpha20'
                : 'success.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'published_count',
        header: 'Chương đã đăng',
        size: 80,
      },
      {
        accessorKey: 'chapter_price',
        header: 'Giá chương',
        size: 80,
      },
      {
        accessorKey: 'read_count',
        header: 'Lượt đọc',
        size: 80,
      },
      {
        accessorKey: 'vote_count',
        header: 'Lượt bình chọn',
        size: 80,
      },
      {
        accessorKey: 'comment_count',
        header: 'Lượt bình luận',
        size: 80,
      },
    ],
    [],
  );

  const initialState = {
    columnVisibility: {
      comment_count: false,
      vote_count: false,
      read_count: false,
      chapter_price: false,
      published_count: false,
      is_mature: false,
      is_draft: false,
      cover_url: false,
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
        <title>Stories | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Quản lý truyện</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div></div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="edit"
                  onClick={() => {
                    router.push(`admin/stories/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Visibility />
                  </SvgIcon>
                  Xem
                </MenuItem>,
                <MenuItem key="delete" onClick={() => console.info('Delete')}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Edit />
                  </SvgIcon>
                  Chỉnh sửa
                </MenuItem>,
              ]}
              {...SHARED_TABLE_PROPS}
              // renderRowActions={({ row }) => {
              //   return (
              //     <Stack direction="row" gap="8px">
              //       <Button
              //         sx={{ ...TABLE_ACTION_BUTTON_SX }}
              //         startIcon={
              //           <SvgIcon
              //             fontSize="small"
              //             sx={{ width: '12px', mr: '0px' }}>
              //             <Visibility />
              //           </SvgIcon>
              //         }
              //         variant="outlined"
              //         color="success"
              //         onClick={() => {
              //           router.push(`/reports/${row.original.id}`);
              //         }}>
              //         Xem
              //       </Button>
              //       <Button
              //         sx={{ ...TABLE_ACTION_BUTTON_SX }}
              //         startIcon={
              //           <SvgIcon
              //             fontSize="small"
              //             sx={{ width: '12px', mr: '0px' }}>
              //             <Edit />
              //           </SvgIcon>
              //         }
              //         variant="outlined"
              //         onClick={() => {
              //           router.push(`/reports/${row.original.id}`);
              //         }}>
              //         Chỉnh sửa
              //       </Button>
              //     </Stack>
              //   );
              // }}
              columns={columns}
              data={stories}
              initialState={initialState}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default StoryPage;
