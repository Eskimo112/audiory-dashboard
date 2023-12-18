import React, { useEffect, useState } from 'react';

import Head from 'next/head';

import { Close, PublishRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';

import {
  CHIP_BG_COLORS,
  CHIP_FONT_COLORS,
} from '../../../constants/chip_colors';
import { useAuth } from '../../../hooks/use-auth';
import ChapterVersionService from '../../../services/chapter-version';
import { formatDate } from '../../../utils/formatters';
import { toastError, toastSuccess } from '../../../utils/notification';
import LoadingPage from '../../loading';

const REPORT_TYPE_MAP = {
  USER: 'Người dùng',
  STORY: 'Truyện',
  COMMENT: 'Bình luận',
  REVENUE_COMPLAINT: 'Doanh thu',
  CONTENT_VIOLATION_COMPLAINT: 'Vi phạm nội dung',
};

const REPORT_STATUS_MAP = {
  APPROVED: 'Chấp nhận',
  PROCESSING: 'Đang xử lý',
  REJECTED: 'Bị từ chối',
};

const ReportListPage = ({ reportId }) => {
  const requestHeader = useRequestHeader();
  const { user } = useAuth();
  const [currentReport, setCurrentReport] = useState(reportId);
  const [page, setPage] = useState(1);
  const { data: response = {}, isLoading } = useQuery(
    ['user', user.id, 'reports', page],

    async () =>
      await new UserService(requestHeader).getReportsByUserId(user.id, page),
    { refetchOnWindowFocus: false, enabled: Boolean(user.id) },
  );
  const reports = response.data ?? [];
  const totalPage = response.total_page ?? 0;

  // const { data: chapterVersionData = {} } = useQuery(
  //   ['chapterVersion', currentReport.reported_id],
  //   async () =>
  //     await new ChapterVersionService(requestHeader).getById(
  //       currentReport.reported_id,
  //     ),
  //   {
  //     enabled:
  //       currentReport.report_type === 'CONTENT_VIOLATION_COMPLAINT' &&
  //       currentReport.report_status === 'APPROVED',
  //     refetchOnWindowFocus: false,
  //   },
  // );

  useEffect(() => {
    if (!reports) return;
    const matchedReport = reports.find((report) => report.id === reportId);
    if (matchedReport) setCurrentReport(matchedReport);
  }, [reportId, reports]);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Danh sách báo cáo | Audiory</title>
      </Head>
      <div style={{ width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Container
            maxWidth="xl"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginY: 4,
            }}>
            <Grid container xs={12} md={6}>
              <Stack
                spacing={1}
                width="100%"
                gap="20px"
                justifyContent="center"
                alignItems="center">
                <Stack sx={{ marginY: 1, fontStyle: 'italic' }}>
                  <Typography variant="h4">Danh sách báo cáo</Typography>
                </Stack>

                <Stack gap="8px">
                  {reports.map((report, index) => {
                    const status =
                      !report.approved_by && !report.rejected_by
                        ? 'PROCESSING'
                        : report.approved_by
                        ? 'APPROVED'
                        : 'REJECTED';
                    return (
                      <Button
                        fullWidth
                        key={index}
                        variant="text"
                        onClick={() => setCurrentReport(report)}
                        sx={{
                          cursor: 'pointer',
                          textAlign: 'left',
                          justifyContent: 'start',
                          position: 'relative',
                          border: '1px solid',
                          borderRadius: 1,
                          borderColor: 'sky.lighter',
                          overflow: 'hidden',
                        }}>
                        <Stack
                          width="100%"
                          direction="row"
                          justifyContent="space-between"
                          gap="12px">
                          <Stack
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                            <Typography
                              variant="body1"
                              color="ink.main"
                              fontWeight={600}>
                              {report.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="ink.lighter"
                              fontStyle="italic">
                              {report.description}
                            </Typography>
                          </Stack>
                          <Stack gap="8px">
                            <Typography
                              variant="body2"
                              color="ink.lighter"
                              fontWeight={600}
                              fontStyle="italic">
                              {formatDate(report.created_date)}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontSize={14}
                              color={
                                status === 'PROCESSING'
                                  ? 'ink.main'
                                  : status === 'APPROVED'
                                  ? 'success.main'
                                  : 'error.main'
                              }
                              fontWeight={600}
                              fontStyle="italic">
                              {REPORT_STATUS_MAP[status]}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>

                <Pagination
                  count={totalPage}
                  page={page}
                  color="primary"
                  onChange={(_, page) => setPage(page)}
                />
              </Stack>
            </Grid>
          </Container>
        </Box>
        {currentReport && (
          <Dialog
            open={Boolean(currentReport)}
            onClose={() => setCurrentReport(null)}
            PaperProps={{
              sx: {
                width: '100%',
                maxHeight: '90%',
                borderRadius: 3,
                overflow: 'auto',
              },
            }}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Chi tiết báo cáo</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setCurrentReport(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}>
              <Close />
            </IconButton>
            <DialogContent dividers>
              <Stack gap="12px">
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center">
                  <Typography variant="body1" fontWeight={600} fontSize={16}>
                    Loại báo cáo
                  </Typography>
                  {(() => {
                    const idx = Object.keys(REPORT_TYPE_MAP).indexOf(
                      currentReport.report_type,
                    );
                    return (
                      <Chip
                        label={REPORT_TYPE_MAP[currentReport.report_type]}
                        sx={{
                          backgroundColor: CHIP_BG_COLORS[idx],
                          color: CHIP_FONT_COLORS[idx],
                        }}
                      />
                    );
                  })()}
                </Stack>
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center">
                  <Typography variant="body1" fontWeight={600} fontSize={16}>
                    Tiêu đề
                  </Typography>
                  <Typography variant="body2" fontStyle="italic" fontSize={15}>
                    {currentReport.title}
                  </Typography>
                </Stack>
                <Stack direction="column" width="100%">
                  <Typography variant="body1" fontWeight={600} fontSize={16}>
                    Nội dung
                  </Typography>
                  <Typography variant="body2" fontStyle="italic" fontSize={15}>
                    {currentReport.description}
                  </Typography>
                </Stack>
                {currentReport.image_url && (
                  <Stack direction="column" width="100%">
                    <Typography variant="body1" fontWeight={600} fontSize={16}>
                      Hình ảnh
                    </Typography>
                    <Box
                      component="img"
                      src={currentReport.image_url}
                      sx={{ objectFit: 'cover' }}
                      alt={'report image'}
                      width={150}></Box>
                  </Stack>
                )}
              </Stack>
            </DialogContent>
            <DialogContent dividers>
              <Stack gap="12px" alignItems="center">
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center">
                  <Typography variant="body1" fontWeight={600} fontSize={16}>
                    Kết quả
                  </Typography>
                  {(() => {
                    const status =
                      !currentReport.approved_by && !currentReport.rejected_by
                        ? 'PROCESSING'
                        : currentReport.approved_by
                        ? 'APPROVED'
                        : 'REJECTED';
                    const idx = Object.keys(REPORT_STATUS_MAP).indexOf(status);
                    return (
                      <Chip
                        label={REPORT_STATUS_MAP[status]}
                        sx={{
                          backgroundColor: CHIP_BG_COLORS[idx],
                          color: CHIP_FONT_COLORS[idx],
                        }}
                      />
                    );
                  })()}
                </Stack>
                {(currentReport.approved_by || currentReport.rejected_by) && (
                  <Stack direction="column" width="100%">
                    <Typography variant="body1" fontWeight={600} fontSize={16}>
                      Nội dung phản hồi
                    </Typography>
                    <Typography
                      variant="body2"
                      fontStyle="italic"
                      fontSize={15}>
                      {currentReport.response_message}
                    </Typography>
                  </Stack>
                )}
                {currentReport.report_type === 'CONTENT_VIOLATION_COMPLAINT' &&
                  currentReport.report_status === 'APPROVED' && (
                    <Button
                      variant="contained"
                      startIcon={
                        <SvgIcon>
                          <PublishRounded></PublishRounded>
                        </SvgIcon>
                      }
                      sx={{ width: 'fit-content' }}
                      onClick={async () => {
                        await new ChapterVersionService(requestHeader)
                          .publish(currentReport.reported_id)
                          .then(() => {
                            toastSuccess('Đăng tải chương thành công');
                          })
                          .catch((error) => {
                            if (
                              error.response &&
                              error.response.data &&
                              error.response.data.message
                            ) {
                              toastError(error.response.data.message);
                              return;
                            }
                            toastError('Đã xảy ra lỗi, thử lại sau');
                          })
                          .finally(() => setCurrentReport(null));
                      }}>
                      Đăng tải chương
                    </Button>
                  )}
              </Stack>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default ReportListPage;
