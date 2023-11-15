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
import { AppImageUpload } from '@/components/app-image-upload';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import CoinPackService from '@/services/coinpack';
import { toastError, toastSuccess } from '@/utils/notification';

const CoinpackEditPage = ({ coinpackId }) => {
  const requestHeader = useRequestHeader();
  const { data: coinpack = {}, isLoading } = useQuery(
    ['coinpacks', coinpackId],
    async () => await new CoinPackService(requestHeader).getById(coinpackId),
  );

  const [openDialog, setOpenDialog] = useState();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState();
  const formik = useFormik({
    initialValues: {
      name: coinpack?.name ?? '',
      coin_amount: coinpack?.coin_amount ?? 0,
      price: coinpack?.price ?? 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Không được để trống'),
      coin_amount: Yup.number().min(0).required('Không được để trống'),
      price: Yup.number().min(1000).required('Không được để trống'),
    }),
    onSubmit: async (values, helpers) => {
      await new CoinPackService(requestHeader).update({
        body: {
          name: values.name,
          coin_amount: values.coin_amount,
          price: values.price,
          form_file: selectedFile ?? undefined,
        },
        coinpackId,
      });
      toastSuccess('Chỉnh sửa thành công');
      queryClient.invalidateQueries({ queryKey: ['coin-pack', coinpackId] });
    },
  });

  const canSaveChanges = useMemo(() => {
    if (selectedFile) return true;

    if (!coinpack) return false;
    if (!formik.values) return false;
    for (const key of Object.keys(formik.values)) {
      if (!formik.values[key] && !coinpack[key]) continue;
      if (formik.values[key] !== coinpack[key]) {
        return true;
      }
    }
    return false;
  }, [formik.values, coinpack, selectedFile]);

  const handleDeactivate = async () => {
    try {
      if (coinpack?.deleted_date) {
        await new CoinPackService(requestHeader).activateById(coinpackId);
        toastSuccess('Đã kích hoạt thành công');
      } else {
        await new CoinPackService(requestHeader).deactivateById(coinpackId);
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
        <title>Sửa {coinpack?.name} </title>
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
                <Typography variant="h4">Chỉnh sửa gói xu</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={coinpack?.name} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content">
                <Button
                  variant="outlined"
                  color={!coinpack?.deleted_date ? 'error' : 'success'}
                  onClick={() => setOpenDialog(true)}>
                  {!coinpack?.deleted_date ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
                    {!coinpack?.deleted_date ? ' vô hiệu hóa' : 'kích hoạt'} gói
                    xu này?
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
                    formik.errors.coin_amount ||
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
                      <AppImageUpload
                        defaultUrl={coinpack?.image_url}
                        onChange={(file) => setSelectedFile(file)}
                      />
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
                      value={coinpack.id}
                      type="text"
                    />
                  </Stack>
                  <Stack gap={1}>
                    <FormLabel>Tên gói xu </FormLabel>
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
                  <Grid container spacing={2}>
                    <Grid xs={12} lg={6}>
                      <Stack gap={1}>
                        <FormLabel>Số xu </FormLabel>
                        <TextField
                          error={
                            !!(
                              formik.touched.coin_amount &&
                              formik.errors.coin_amount
                            )
                          }
                          fullWidth
                          helperText={
                            formik.touched.coin_amount &&
                            formik.errors.coin_amount
                          }
                          variant="outlined"
                          name="coin_amount"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.coin_amount}
                          type="number"
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack gap={1}>
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

export default CoinpackEditPage;
