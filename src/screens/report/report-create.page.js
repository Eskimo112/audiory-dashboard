// eslint-disable-next-line simple-import-sort/imports
import Head from 'next/head';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppBreadCrumbs from '../../components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '../../constants/page_sx';
import { useRequestHeader } from '../../hooks/use-request-header';
import ReportService from '../../services/report';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { AppImageUpload } from '../../components/app-image-upload';
import { SHARED_SELECT_PROPS } from '../dashboard/constant';
import { toastError, toastSuccess } from '../../utils/notification';

const REPORT_TYPE_OPTIONS = [
  {
    label: 'Truyện',
    value: 'STORY',
  },
  {
    label: 'Chương',
    value: 'CHAPTER',
  },
  {
    label: 'Người dùng',
    value: 'USER',
  },
  {
    label: 'Bình luận',
    value: 'COMMENT',
  },
  {
    label: 'Khiếu nại doanh thu',
    value: 'REVENUE_COMPLAINT',
  },
  {
    label: 'Khiếu nại vi phạm bản quyền',
    value: 'CONTENT_VIOLATION_COMPLAINT',
  },
];

const ReportCreatePage = () => {
  const requestHeader = useRequestHeader();
  const reportService = new ReportService(requestHeader);

  const [formFile, setFormFile] = useState();
  const { mutate, isLoading } = useMutation(reportService.createReport);

  const formik = useFormik({
    initialValues: {
      userId: '',
      title: '',
      description: '',
      reportType: 'STORY',
      reportedId: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().max(255, 'Tiêu đề không dài quá 255 ký tự'),
      userId: Yup.string().required('Vui lòng nhập id người dùng hợp lệ'),
      reportedId: Yup.string().required('Vui lòng nhập id hợp lệ'),
      description: Yup.string(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutate({
          title: values.title,
          description: values.description,
          user_id: values.userId,
          report_type: values.reportType,
          reported_id: values.reportedId,
          form_file: formFile,
        });
        toastSuccess('Tạo báo cáo thành công');
      } catch (e) {
        toastError(e.toString());
      }
      formik.handleReset();
    },
  });

  return (
    <>
      <Head>
        <title>Tạo báo cáo </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Tạo báo cáo</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs />
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={8}>
                <Card sx={{ padding: 2 }}>
                  <CardHeader title="Điền thông tin" sx={{ pt: 0, pl: 0 }} />
                  <Stack gap={2}>
                    <Stack gap={1}>
                      <FormLabel>Id người tạo</FormLabel>
                      <TextField
                        fullWidth
                        error={
                          !!(formik.touched.userId && formik.errors.userId)
                        }
                        helperText={
                          formik.touched.userId && formik.errors.userId
                        }
                        variant="outlined"
                        name="userId"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.userId}
                      />
                    </Stack>
                    <Stack direction="row" gap={2}>
                      <Stack gap={1} flex={1}>
                        <FormLabel>Id bị báo cáo</FormLabel>
                        <TextField
                          fullWidth
                          error={
                            !!(
                              formik.touched.reportedId &&
                              formik.errors.reportedId
                            )
                          }
                          helperText={
                            formik.touched.reportedId &&
                            formik.errors.reportedId
                          }
                          variant="outlined"
                          name="reportedId"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="text"
                          value={formik.values.reportedId}
                        />
                      </Stack>
                      <Stack gap={1}>
                        <FormLabel>Loại báo cáo</FormLabel>
                        <Button
                          color="inherit"
                          size="small"
                          sx={{ padding: 0 }}>
                          <Select
                            {...SHARED_SELECT_PROPS}
                            inputProps={{
                              sx: {
                                padding: '14px 8px',
                                minWidth: '80px',
                              },
                            }}
                            sx={{ padding: 0 }}
                            value={formik.values.reportType}
                            name="reportType"
                            onChange={formik.handleChange}>
                            {REPORT_TYPE_OPTIONS.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Button>
                      </Stack>
                    </Stack>
                    <Stack gap={1}>
                      <FormLabel>Tiêu đề</FormLabel>
                      <TextField
                        error={!!(formik.touched.title && formik.errors.title)}
                        fullWidth
                        helperText={formik.touched.title && formik.errors.title}
                        variant="outlined"
                        name="title"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        type="text"
                      />
                    </Stack>
                    <Stack gap={1}>
                      <FormLabel>Nội dung</FormLabel>
                      <TextField
                        fullWidth
                        error={
                          !!(
                            formik.touched.description &&
                            formik.errors.description
                          )
                        }
                        helperText={
                          formik.touched.description &&
                          formik.errors.description
                        }
                        multiline
                        rows={5}
                        variant="outlined"
                        name="description"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.description}
                      />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid xs={12} lg={4}>
                <Card
                  sx={{
                    padding: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <CardHeader title="Thêm ảnh" sx={{ pt: 0, pl: 0 }} />

                  <Box display="flex" flex={1}>
                    <AppImageUpload onChange={(file) => setFormFile(file)} />
                  </Box>
                </Card>
              </Grid>
              <Grid xs={12} lg={12}>
                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={formik.handleSubmit}>
                  {isLoading ? 'Đang tạo...' : 'Tạo báo cáo'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ReportCreatePage;
