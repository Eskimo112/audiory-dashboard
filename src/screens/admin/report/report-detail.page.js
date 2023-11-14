/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react';

import Head from 'next/head';

import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import AppImage from '@/components/app-image';
import { AppImageUpload } from '@/components/app-image-upload';
import { CHIP_BG_COLORS, CHIP_FONT_COLORS } from '@/constants/chip_colors';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useAuth } from '@/hooks/use-auth';
import { useRequestHeader } from '@/hooks/use-request-header';
import ReportService from '@/services/report';
import { formatDate } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

import ChapterInfo from './chapter-info.component';
import { REPORT_STATUS_MAP, REPORT_TYPE_MAP } from './report.page';
import StoryInfo from './story-info.component';
import UserInfo from './user-info.component';

const ReportDetailPage = ({ reportId }) => {
  const requestHeaders = useRequestHeader();
  const reportService = useMemo(
    () => new ReportService(requestHeaders),
    [requestHeaders],
  );

  const { data: report, isLoading } = useQuery(
    ['report', reportId],
    async () => await reportService.getById(reportId),
  );

  const { user } = useAuth();
  const [imageFile, setImageFile] = useState();

  const formik = useFormik({
    initialValues: {
      content: '',
      result: 'approved',
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values, helpers) => {
      try {
        if (values.result === 'approved')
          await reportService.updateReport({
            reportId,
            approved_date: new Date().toUTCString(),
            aprroved_by: user.id,
            report_status: 'APPROVED',
            form_file: imageFile,
          });
        else
          await reportService.updateReport({
            reportId,
            rejected_date: new Date().toUTCString(),
            rejected_by: user.id,
            report_status: 'APPROVED',
            form_file: imageFile,
          });
        toastSuccess('Xử lý báo cáo thành công');
      } catch (error) {
        toastError('Có lỗi xảy ra. Thử lại sau');
      }
    },
  });

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Head>
        <title>Chi tiết báo cáo </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Chi tiết báo cáo</Typography>
                <AppBreadCrumbs />
              </Stack>
            </Stack>

            <Card sx={{ padding: 2 }}>
              <Grid container spacing={3}>
                <Grid xs={12} lg={4}>
                  {/* <UploadImage /> */}
                  {report.image_url ? (
                    <Box
                      component="img"
                      width="100%"
                      height="100%"
                      src={report.image_url}
                      alt="report image"
                    />
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%">
                      Không có ảnh
                    </Box>
                  )}
                </Grid>
                <Grid xs={12} lg={8}>
                  <Stack color="primary.main" direction="row" gap="4px">
                    <SvgIcon sx={{ width: '16px' }}>
                      <ClockIcon />
                    </SvgIcon>
                    <Typography variant="body1" fontStyle="italic">
                      {formatDate(report.created_date)}
                    </Typography>
                  </Stack>
                  <Stack gap="12px">
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center">
                      <Typography variant="h6" fontWeight={600} fontSize="17px">
                        Người tạo báo cáo
                      </Typography>
                      <UserInfo userId={report.user_id} isReversed />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center">
                      <Typography variant="h6" fontWeight={600} fontSize="17px">
                        Loại báo cáo
                      </Typography>
                      {(() => {
                        if (!report.report_type) return <></>;
                        const idx = Object.keys(REPORT_TYPE_MAP).indexOf(
                          report.report_type,
                        );
                        return (
                          <Chip
                            label={REPORT_TYPE_MAP[report.report_type]}
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
                      justifyContent="space-between"
                      alignItems="center">
                      <Typography variant="h6" fontWeight={600} fontSize="17px">
                        Đối tượng bị báo cáo
                      </Typography>
                      {(() => {
                        const reportType = report.report_type;
                        const reportedId = report.reported_id;
                        switch (reportType) {
                          case 'USER':
                            return <UserInfo userId={reportedId} isReversed />;
                          case 'STORY':
                            return (
                              <StoryInfo storyId={reportedId} isReversed />
                            );
                          case 'CHAPTER':
                            return <ChapterInfo chapterId={reportedId} />;
                        }
                        return null;
                      })()}
                    </Stack>
                    <Stack
                      sx={{
                        borderRadius: '12px',
                        padding: '12px',
                        backgroundColor: 'ink.alpha10',
                        gap: '8px',
                      }}>
                      <Stack>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          fontSize="16px">
                          Tiêu đề:
                        </Typography>
                        <Typography fontSize="16px">{report.title}</Typography>
                      </Stack>
                      <Stack>
                        <Typography variant="body1" fontWeight={600}>
                          Mô tả:
                        </Typography>
                        <Typography variant="body1">
                          {report.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ padding: 2 }}>
              <Stack
                gap="4px"
                alignItems="center"
                justifyContent="center"
                height="100%">
                {(() => {
                  if (!report.report_status) return <></>;
                  const idx = Object.keys(REPORT_STATUS_MAP).indexOf(
                    report.report_status,
                  );
                  return (
                    <Box
                      sx={{
                        borderRadius: '12px',
                        padding: '12px',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        backgroundColor: CHIP_BG_COLORS[idx],
                        color: CHIP_FONT_COLORS[idx],
                        textTransform: 'uppercase',
                        fontSize: '20px',
                      }}>
                      {REPORT_STATUS_MAP[report.report_status]}
                    </Box>
                  );
                })()}
              </Stack>
            </Card>

            <Grid container spacing={3} justifyContent="center">
              <Grid xs={12} lg={12}>
                {report.report_status === 'PROCESSING' ? (
                  <Card sx={{ padding: 2 }}>
                    <CardHeader
                      title="Xử lý báo cáo"
                      sx={{ padding: 0, pb: 2 }}
                    />
                    <Grid container spacing={3}>
                      <Grid xs={12} lg={4}>
                        <AppImageUpload
                          onChange={(file) => setImageFile(file)}
                        />
                      </Grid>
                      <Grid xs={12} lg={8}>
                        <Stack
                          gap="8px"
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            fontSize="17px">
                            Kết quả xử lý
                          </Typography>
                          <RadioGroup
                            defaultValue="approved"
                            name="result"
                            value={formik.values.result}
                            onChange={formik.handleChange}
                            sx={{ display: 'flex', flexDirection: 'row' }}>
                            <FormControlLabel
                              value="rejected"
                              control={<Radio />}
                              label="Từ chối"
                            />
                            <FormControlLabel
                              value="approved"
                              control={<Radio />}
                              label="Chấp nhận"
                            />
                          </RadioGroup>
                        </Stack>
                        <Stack gap="8px">
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            fontSize="17px">
                            Nội dung phản hồi
                          </Typography>
                          <OutlinedInput
                            name="content"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.content}
                            fullWidth
                            placeholder="Nhập phản hồi tại đây"
                            multiline
                            rows={5}
                            sx={{ mb: 2 }}
                          />
                          <Button
                            variant="contained"
                            onClick={formik.handleSubmit}>
                            Gửi
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Card>
                ) : (
                  <Card sx={{ padding: 2 }}>
                    <Stack color="primary.main" direction="row" gap="4px">
                      <SvgIcon sx={{ width: '16px' }}>
                        <ClockIcon />
                      </SvgIcon>
                      <Typography variant="body1" fontStyle="italic">
                        {formatDate(report.rejected_date)}
                      </Typography>
                    </Stack>
                    <Stack gap="12px">
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          fontSize="17px">
                          Người xử lý
                        </Typography>
                        <UserInfo
                          userId={report.rejected_by ?? report.approved_by}
                          isReversed
                        />
                      </Stack>

                      <Stack
                        sx={{
                          borderRadius: '12px',
                          padding: '12px',
                          backgroundColor: 'ink.alpha10',
                          gap: '8px',
                        }}>
                        <Stack>
                          <Typography variant="body1" fontWeight={600}>
                            Nội dung phản hồi:
                          </Typography>
                          <Typography variant="body1">
                            {report.response_message ?? 'Không có'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ReportDetailPage;