import { useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import { useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { AppImageUpload } from '@/components/app-image-upload';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import CategoryService from '@/services/category';
import { toastError, toastSuccess } from '@/utils/notification';

const CategoryEditPage = ({ categoryId }) => {
  const requestHeader = useRequestHeader();
  const { data: category = {}, isLoading } = useQuery(
    ['category', categoryId],
    async () => await new CategoryService(requestHeader).getById(categoryId),
  );
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState();
  const formik = useFormik({
    initialValues: {
      name: category?.name ?? '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Không được để trống'),
    }),
    onSubmit: async (values, helpers) => {
      await new CategoryService(requestHeader).update({
        body: {
          name: values.name,
          form_file: selectedFile ?? undefined,
        },
        categoryId,
      });
      toastSuccess('Chỉnh sửa thành công');
      queryClient.invalidateQueries({ queryKey: ['stories', categoryId] });
    },
  });

  const canSaveChanges = useMemo(() => {
    if (selectedFile) return true;

    if (!category) return false;
    if (!formik.values) return false;
    for (const key of Object.keys(formik.values)) {
      if (!formik.values[key] && !category[key]) continue;
      if (formik.values[key] !== category[key]) {
        return true;
      }
    }
    return false;
  }, [formik.values, category, selectedFile]);

  const handleDelete = async () => {
    try {
      await new CategoryService(requestHeader).deleteById(categoryId);
      router.push('/admin/categories');
      toastSuccess('Đã xóa thành công');
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    setOpenDialog(false);
  };

  if (isLoading)
    return (
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container
          maxWidth="xl"
          sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );

  return (
    <>
      <Head>
        <title>Thể loại {category?.name} </title>
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
                <Typography variant="h4">Chỉnh sửa thể loại</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={category?.name} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content">
                <Button
                  variant="outlined"
                  color={'error'}
                  onClick={() => setOpenDialog(true)}>
                  Xóa
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  PaperProps={{
                    sx: {
                      p: 1,
                      width: '400px',
                    },
                  }}>
                  <DialogTitle>Bạn có chắc chắn xóa thể loại này?</DialogTitle>
                  <DialogContent>
                    {/* <DialogContentText>
                      Điều này sẽ làm truyện bị ẩn khỏi tất cả người dùng, bao
                      gồm cả tác giả
                    </DialogContentText> */}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenDialog(false)}>
                      Hủy bỏ
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDelete}
                      autoFocus>
                      Xác nhận
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  disabled={!canSaveChanges}
                  variant="contained"
                  onClick={() => formik.handleSubmit()}>
                  Lưu thay đổi
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              {/* Image */}
              <Grid xs={12} lg={6}>
                <Card sx={{ padding: 2 }}>
                  <Stack gap="16px" alignItems="center">
                    <Box
                      sx={{
                        width: '95%',
                        marginBottom: '0px',
                        aspectRatio: '1',
                        height: '200px',
                      }}>
                      <AppImageUpload
                        defaultUrl={category?.image_url}
                        onChange={(file) => setSelectedFile(file)}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              {/* Input information */}
              <Grid xs={12} lg={6}>
                <Card sx={{ padding: 2 }}>
                  <Stack gap={1}>
                    <FormLabel>Id </FormLabel>
                    <TextField
                      disabled
                      fullWidth
                      variant="outlined"
                      name="name"
                      value={category.id}
                      type="text"
                    />
                  </Stack>
                  <Stack gap={1}>
                    <FormLabel>Tên thể loại </FormLabel>
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
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default CategoryEditPage;
