import Head from 'next/head';

import {
  Box,
  Button,
  Card,
  Container,
  FormLabel,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import LevelService from '@/services/level';
import { toastSuccess } from '@/utils/notification';

const AuthorLevelCreatePage = () => {
  const requestHeader = useRequestHeader();

  const formik = useFormik({
    initialValues: {
      name: '',
      min_stories: 0,
      min_reads: 0,
      min_votes: 0,
      min_comments: 0,
      min_donations: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Không được để trống'),
      min_stories: Yup.number().min(0).required('Không được để trống'),
      min_reads: Yup.number().min(0).required('Không được để trống'),
      min_votes: Yup.number().min(0).required('Không được để trống'),
      min_comments: Yup.number().min(0).required('Không được để trống'),
      min_donations: Yup.number().min(0).required('Không được để trống'),
    }),
    onSubmit: async (values, helpers) => {
      await new LevelService(requestHeader).createAuthorLevel({
        body: {
          name: values.name,
          min_stories: values.min_stories,
          min_reads: values.min_reads,
          min_votes: values.min_votes,
          min_comments: values.min_comments,
          min_donations: values.min_donations,
        },
      });
      helpers.resetForm();
      toastSuccess('Tạo cấp thành công');
    },
  });

  return (
    <>
      <Head>
        <title>Tạo cấp </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
              alignItems="flex-end"
              px="16px">
              <Stack spacing={1}>
                <Typography variant="h4">Tạo thêm một cấp</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content">
                <Button
                  disabled={
                    formik.errors.name ||
                    formik.errors.min_comments ||
                    formik.errors.min_donations ||
                    formik.errors.min_reads ||
                    formik.errors.min_stories ||
                    formik.errors.min_votes
                  }
                  variant="contained"
                  onClick={() => formik.handleSubmit()}>
                  Tạo
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={3} justifyContent="center">
              {/* Input information */}
              <Grid xs={12} lg={12}>
                <Card
                  sx={{
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}>
                  <Stack direction="row" gap="16px">
                    <Stack gap={1} flex={1}>
                      <FormLabel>Tên cấp </FormLabel>
                      <TextField
                        error={!!(formik.touched.name && formik.errors.name)}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        variant="outlined"
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        type="text"
                      />
                    </Stack>
                    <Stack gap={1} flex={1}>
                      <FormLabel>Truyện tối thiểu </FormLabel>
                      <TextField
                        error={
                          !!(
                            formik.touched.min_stories &&
                            formik.errors.min_stories
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.min_stories &&
                          formik.errors.min_stories
                        }
                        variant="outlined"
                        name="min_stories"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.min_stories}
                        type="number"
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" gap="16px">
                    <Stack gap={1} flex={1}>
                      <FormLabel>Lượt đọc tối thiểu </FormLabel>
                      <TextField
                        error={
                          !!(
                            formik.touched.min_reads && formik.errors.min_reads
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.min_reads && formik.errors.min_reads
                        }
                        variant="outlined"
                        name="min_reads"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.min_reads}
                        type="number"
                      />
                    </Stack>
                    <Stack gap={1} flex={1}>
                      <FormLabel>Bình luận tối thiểu </FormLabel>
                      <TextField
                        error={
                          !!(
                            formik.touched.min_comments &&
                            formik.errors.min_comments
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.min_comments &&
                          formik.errors.min_comments
                        }
                        variant="outlined"
                        name="min_comments"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.min_comments}
                        type="number"
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" gap="16px">
                    <Stack gap={1} flex={1}>
                      <FormLabel>Ủng hộ tối thiểu </FormLabel>
                      <TextField
                        error={
                          !!(
                            formik.touched.min_donations &&
                            formik.errors.min_donations
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.min_donations &&
                          formik.errors.min_donations
                        }
                        variant="outlined"
                        name="min_donations"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.min_donations}
                        type="number"
                      />
                    </Stack>
                    <Stack gap={1} flex={1}>
                      <FormLabel>Bình chọn tối thiểu </FormLabel>
                      <TextField
                        error={
                          !!(
                            formik.touched.min_votes && formik.errors.min_votes
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.min_votes && formik.errors.min_votes
                        }
                        variant="outlined"
                        name="min_votes"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.min_votes}
                        type="number"
                      />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default AuthorLevelCreatePage;
