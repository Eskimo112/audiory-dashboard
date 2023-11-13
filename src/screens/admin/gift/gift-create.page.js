// eslint-disable-next-line simple-import-sort/imports
import Head from 'next/head';

import {
  Box,
  Button,
  Card,
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
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { AppImageUpload } from '@/components/app-image-upload';
import { toastError, toastSuccess } from '@/utils/notification';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import CategoryService from '../../../services/category';

const GiftCreatePage = () => {
  const requestHeader = useRequestHeader();

  const categoryService = useMemo(() => {
    return new CategoryService(requestHeader);
  }, [requestHeader]);

  const [formFile, setFormFile] = useState();
  const { mutate, isLoading } = useMutation(
    ({ body }) => categoryService.create({ body }),
    {
      onSuccess: () => {
        toastSuccess('Tạo thể loại xu thành công');
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
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().max(255, 'Tên không dài quá 255 ký tự'),
    }),
    onSubmit: async (values, helpers) => {
      await mutate({
        body: {
          name: values.name,
          form_file: formFile,
        },
      });
    },
  });

  return (
    <>
      <Head>
        <title>Tạo thể loại </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Tạo thể loại</Typography>
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
                  Tạo thể loại
                </Button>
              </div>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={8}>
                <Card sx={{ padding: 2 }}>
                  <Stack gap={2}>
                    <Stack gap={1}>
                      <FormLabel>Tên thể loại</FormLabel>
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
                  </Stack>
                </Card>
              </Grid>
              <Grid xs={12} lg={4}>
                <Card
                  sx={{
                    padding: 2,
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
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

export default GiftCreatePage;
