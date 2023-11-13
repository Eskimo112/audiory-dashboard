import { useMemo } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
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

import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '@/constants/chip_colors';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import ReportService from '@/services/report';
import { formatDate } from '@/utils/formatters';

import ChapterInfo from './chapter-info.component';
import StoryInfo from './story-info.component';
import UserInfo from './user-info.component';

export const REPORT_TYPE_MAP = {
  USER: 'Người dùng',
  STORY: 'Truyện',
  COMMENT: 'Bình luận',
  CHAPTER: 'Chương',
};
export const REPORT_STATUS_MAP = {
  APPROVED: 'Chấp nhận',
  PROCESSING: 'Đang xử lý',
  REJECTED: 'Bị từ chối',
};

const ReportPage = () => {
  const requestHeaders = useRequestHeader();
  const reportService = useMemo(
    () => new ReportService(requestHeaders),
    [requestHeaders],
  );

  const { data: reports, isLoading } = useQuery(
    ['report'],
    async () => await reportService.getAll(),
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
        header: 'Người báo cáo',
        size: 80,
        Cell: ({ row }) => <UserInfo userId={row.original.user_id} />,
      },
      {
        accessorKey: 'title',
        header: 'Tiêu đề',
      },
      {
        accessorKey: 'report_type',
        header: 'Loại báo cáo',
        size: 80,
        accessorFn: (row) => {
          if (!row.report_type) return 'Không xác định';
          return REPORT_TYPE_MAP[row.report_type];
        },
        filterFn: 'equals',
        filterSelectOptions: Object.values(REPORT_TYPE_MAP).map((value) => ({
          text: value,
          value,
        })),
        filterVariant: 'select',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return <></>;
          const idx = Object.values(REPORT_TYPE_MAP).indexOf(cell.getValue());
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
        accessorKey: 'reported_id', // normal accessorKey
        header: 'Đối tượng báo cáo ',
        Cell: ({ row }) => {
          const reportType = row.original.report_type;
          const reportedId = row.original.reported_id;
          switch (reportType) {
            case 'USER':
              return <UserInfo userId={reportedId} />;
            case 'STORY':
              return <StoryInfo storyId={reportedId} />;
            case 'COMMENT':
              return (
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ textDecoration: 'none' }}>
                    Chi tiết comment
                  </Typography>
                </Link>
              );
            case 'REVENUE_COMPLAINT':
              return <StoryInfo chapterId={reportedId} />;
            case 'CONTENT_VIOLATION_COMPLAINT':
              return <StoryInfo chapterId={reportedId} />;
          }
          return null;
        },
      },
      {
        accessorKey: 'created_date',
        header: 'Ngày tạo',
        size: 80,
        accessorFn: (row) => formatDate(row.created_date),
        // Cell: ({ cell }) => <Chip label={cell.getValue()} />,
      },

      {
        accessorKey: 'report_status',
        header: 'Trạng thái',
        size: 80,
        accessorFn: (row) => {
          if (!row.report_status) return 'Không xác định';
          return REPORT_STATUS_MAP[row.report_status];
        },
        filterFn: 'equals',
        filterSelectOptions: Object.values(REPORT_STATUS_MAP).map((value) => ({
          text: value,
          value,
        })),
        filterVariant: 'select',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return <></>;
          const idx = Object.values(REPORT_STATUS_MAP).indexOf(cell.getValue());
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
        <title>Báo cáo | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Quản lý báo cáo</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                {/* <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push('reports/create')}>
                  Thêm báo cáo
                </Button> */}
              </div>
            </Stack>

            <MaterialReactTable
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
                      router.push(`/admin/reports/${row.original.id}`);
                    }}>
                    {row.original.report_status === 'PROCESSING'
                      ? `Xử lý`
                      : `Xem chi tiết`}
                  </Button>
                );
              }}
              columns={columns}
              data={reports}
              initialState={initialState}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ReportPage;
