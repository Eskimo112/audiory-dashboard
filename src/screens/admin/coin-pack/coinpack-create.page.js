// eslint-disable-next-line simple-import-sort/imports
import Head from 'next/head';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  FormLabel,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { AppImageUpload } from '@/components/app-image-upload';
import { toastError, toastSuccess } from '@/utils/notification';
import CoinPackService from '../../../services/coinpack';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';

const CoinPackCreatePage = () => {
  const requestHeader = useRequestHeader();

  const [formFile, setFormFile] = useState();
  const { mutate, isLoading } = useMutation(
    new CoinPackService(requestHeader).create,
    {
      onSuccess: () => {
        toastSuccess('Tạo gói xu thành công');
        formik.handleReset();
      },
      onError: (error) => {
        toastError(error.toString());
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      coin_amount: null,
      price: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().max(255, 'Tên gói không dài quá 255 ký tự'),
      coin_amount: Yup.number()
        .min(1, 'Vui lòng nhập số > 0')
        .max(10000, 'Không quá 10000 coin')
        .required('Không được để trống'),
      price: Yup.number()
        .min(1000, 'Vui lòng nhập số >= 1000')
        .required('Không được để trống'),
    }),
    onSubmit: async (values, helpers) => {
      await mutate({
        body: {
          name: values.name,
          coin_amount: values.coin_amount,
          price: values.price,
          form_file: formFile,
        },
      });
    },
  });

  return (
    <>
      <Head>
        <title>Tạo gói xu </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Tạo gói xu</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs />
              </Stack>
              <div>
                <Button
                  disabled={isLoading}
                  onClick={() => formik.handleSubmit()}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained">
                  Tạo gói xu
                </Button>
              </div>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={8}>
                <Card sx={{ padding: 2 }}>
                  <CardHeader title="Điền thông tin" sx={{ pt: 0, pl: 0 }} />
                  <Stack gap={2}>
                    <Stack gap={1}>
                      <FormLabel>Tên gói xu</FormLabel>
                      <TextField
                        fullWidth
                        error={!!(formik.touched.name && formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        variant="outlined"
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.name}
                      />
                    </Stack>
                    <Stack direction="row" gap={2}>
                      <Stack gap={1} flex={1}>
                        <FormLabel>Số xu</FormLabel>
                        <TextField
                          fullWidth
                          error={
                            !!(
                              formik.touched.coin_amount &&
                              formik.errors.coin_amount
                            )
                          }
                          helperText={
                            formik.touched.coin_amount &&
                            formik.errors.coin_amount
                          }
                          variant="outlined"
                          name="coin_amount"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="number"
                          value={formik.values.coin_amount}
                        />
                      </Stack>

                      <Stack gap={1} flex={1}>
                        <FormLabel>Giá tiền</FormLabel>
                        <TextField
                          fullWidth
                          error={
                            !!(formik.touched.price && formik.errors.price)
                          }
                          helperText={
                            formik.touched.price && formik.errors.price
                          }
                          variant="outlined"
                          name="price"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="number"
                          value={formik.values.price}
                        />
                      </Stack>
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
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default CoinPackCreatePage;
