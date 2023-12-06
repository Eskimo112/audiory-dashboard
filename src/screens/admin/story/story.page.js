// eslint-disable-next-line simple-import-sort/imports
import { useMemo, useState } from 'react';

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
import StoryService from '@/services/story';
import {
  ToggleOnOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useRequestHeader } from '../../../hooks/use-request-header';
import { STATUS_MAP } from '../../../constants/status_map';
import { toastError, toastSuccess } from '../../../utils/notification';

const StoryPage = () => {
  const requestHeader = useRequestHeader();
  const {
    data: stories,
    isLoading,
    refetch,
  } = useQuery(
    ['stories'],
    async () => await new StoryService(requestHeader).getAll(),
  );

  const [openDialog, setOpenDialog] = useState(false);

  const handleDeactivate = async (story) => {
    try {
      if (story?.deleted_date) {
        await new StoryService(requestHeader).activateById(story.id);
        toastSuccess('Đã kích hoạt thành công');
      } else {
        await new StoryService(requestHeader).deactivateById(story.id);
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
                router.push(`/admin/users/${author.id}`);
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
    [router],
  );

  const initialState = {
    columnVisibility: {
      comment_count: false,
      vote_count: false,
      read_count: false,
      chapter_price: false,
      published_count: false,
      is_mature: false,
      is_completed: false,
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
                  key="show"
                  onClick={() => {
                    router.push(`/admin/stories/${row.original.id}`);
                  }}>
                  <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
                    <Visibility />
                  </SvgIcon>
                  Xem chi tiết
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
                      truyện này?
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
