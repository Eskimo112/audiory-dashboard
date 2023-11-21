import { useMemo, useState } from 'react';

import Head from 'next/head';

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
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import GiftService from '@/services/gift';
import { toastError, toastSuccess } from '@/utils/notification';

import { AppLottie } from '../../../components/app-lottie';

const GiftEditPage = ({ giftId }) => {
  const requestHeader = useRequestHeader();
  const { data: gift = {}, isLoading } = useQuery(
    ['gifts', giftId],
    async () => await new GiftService(requestHeader).getById(giftId),
  );

  const [openDialog, setOpenDialog] = useState();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState();
  const formik = useFormik({
    initialValues: {
      name: gift?.name ?? '',
      description: gift?.description ?? 0,
      price: gift?.price ?? 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Không được để trống'),
      description: Yup.string().max(255).required('Không được để trống'),
      price: Yup.number().min(1).required('Không được để trống'),
    }),
    onSubmit: async (values, helpers) => {
      await new GiftService(requestHeader).update({
        body: {
          name: values.name,
          description: values.description,
          price: values.price,
          form_file: selectedFile ?? undefined,
        },
        giftId,
      });
      toastSuccess('Chỉnh sửa thành công');
      queryClient.invalidateQueries({ queryKey: ['gift', giftId] });
    },
  });

  const canSaveChanges = useMemo(() => {
    if (selectedFile) return true;

    if (!gift) return false;
    if (!formik.values) return false;
    for (const key of Object.keys(formik.values)) {
      if (!formik.values[key] && !gift[key]) continue;
      if (formik.values[key] !== gift[key]) {
        return true;
      }
    }
    return false;
  }, [formik.values, gift, selectedFile]);

  const handleDeactivate = async () => {
    try {
      if (gift?.deleted_date) {
        await new GiftService(requestHeader).activateById(giftId);
        toastSuccess('Đã kích hoạt thành công');
      } else {
        await new GiftService(requestHeader).deactivateById(giftId);
        toastSuccess('Đã vô hiệu hóa thành công');
      }
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
        <title>Sửa {gift?.name} </title>
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
                <Typography variant="h4">Chỉnh sửa quà</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={gift?.name} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content">
                <Button
                  variant="outlined"
                  color={!gift?.deleted_date ? 'error' : 'success'}
                  onClick={() => setOpenDialog(true)}>
                  {!gift?.deleted_date ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
                  <DialogTitle>
                    Bạn có chắc chắn
                    {!gift?.deleted_date ? ' vô hiệu hóa' : 'kích hoạt'} quà này
                    này?
                  </DialogTitle>
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
                      onClick={handleDeactivate}
                      autoFocus>
                      Xác nhận
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  disabled={
                    !canSaveChanges ||
                    formik.errors.description ||
                    formik.errors.name ||
                    formik.errors.price
                  }
                  variant="contained"
                  onClick={() => formik.handleSubmit()}>
                  Lưu thay đổi
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              {/* Image */}
              <Grid xs={12} lg={4}>
                <Card sx={{ padding: 2 }}>
                  <Stack gap="16px" alignItems="center">
                    <Box
                      sx={{
                        width: '95%',
                        marginBottom: '0px',
                        aspectRatio: '1',
                        height: '280px',
                      }}>
                      <AppLottie url={gift?.image_url} />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              {/* Input information */}
              <Grid xs={12} lg={8}>
                <Card
                  sx={{
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}>
                  <Stack gap={1}>
                    <FormLabel>Id </FormLabel>
                    <TextField
                      disabled
                      fullWidth
                      variant="outlined"
                      value={gift.id}
                      type="text"
                    />
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid
                      xs={12}
                      lg={12}
                      spacing={2}
                      sx={{ display: 'flex', gap: '16px' }}>
                      <Stack gap={1} flex={1}>
                        <FormLabel>Tên quà </FormLabel>
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
                        <FormLabel>Giá </FormLabel>
                        <TextField
                          error={
                            !!(formik.touched.price && formik.errors.price)
                          }
                          fullWidth
                          helperText={
                            formik.touched.price && formik.errors.price
                          }
                          variant="outlined"
                          name="price"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.price}
                          type="number"
                        />
                      </Stack>
                    </Grid>

                    <Grid xs={12} lg={12}>
                      <Stack gap={1}>
                        <FormLabel>Mô tả </FormLabel>
                        <TextField
                          multiline
                          rows={5}
                          error={
                            !!(
                              formik.touched.description &&
                              formik.errors.description
                            )
                          }
                          fullWidth
                          helperText={
                            formik.touched.description &&
                            formik.errors.description
                          }
                          variant="outlined"
                          name="description"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.description}
                          type="text"
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default GiftEditPage;
