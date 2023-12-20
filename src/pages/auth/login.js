import Head from 'next/head';
import { useRouter } from 'next/navigation';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import * as Yup from 'yup';

import { toastError } from '@/utils/notification';

import AppIcon from '../../components/app-icon';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().max(255).required('Không được để trống'),
      password: Yup.string().max(255).required('Mật khẩu trống'),
    }),

    onSubmit: async (values, helpers) => {
      await auth
        .signInWithPassword(values.email, values.password)
        .then(() => {
          router.push('/my-works');
        })
        .catch((error) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({
            submit:
              error.response.data.message ?? 'Tài khoản hoặc mật khẩu sai',
          });
          helpers.setSubmitting(false);
          toastError('Đăng nhập không thành công');
        });
    },
  });

  const handleSignInGoogle = async () => {
    try {
      await auth.signInWithGoogle();
      router.push('/my-works');
    } catch (error) {
      toastError('Đăng nhập không thành công');
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập | Audiory</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            width: '100%',
          }}>
          <Stack
            spacing={1}
            sx={{ mb: 3, justifyContent: 'center', alignItems: 'center' }}>
            {/* <AppIcon size={30} /> */}

            <Typography variant="h4">Đăng nhập</Typography>
            <Typography variant="body1" color="ink.lighter" textAlign="center">
              Nơi bạn thỏa sức khám phá và tưởng tượng, đọc, viết và nghe hàng
              triệu câu chuyện hấp dẫn!
            </Typography>
          </Stack>

          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                variant="outlined"
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <TextField
                variant="outlined"
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Mật khẩu"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
              />
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            {/* <Stack
              width="100%"
              justifyContent="flex-end"
              direction="row"
              sx={{ mt: '6px' }}>
              <Typography
                fontSize="14px"
                color="ink.lighter"
                onClick={() => {}}
                sx={{
                  ':hover': {
                    textDecoration: 'underline',
                  },
                  cursor: 'pointer',
                }}>
                Quên mật khẩu?
              </Typography>
            </Stack> */}

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2, fontSize: '16px' }}
              type="submit"
              color="primary"
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
              spin>
              {formik.isSubmitting ? 'Đợi chút xíu...' : 'Đăng nhập'}
            </Button>
          </form>

          <Typography
            variant="body1"
            color="ink.lighter"
            textAlign="center"
            fontSize="16px">
            Hoặc
          </Typography>
          <Button
            fullWidth
            size="large"
            sx={{ mt: 2, bgcolor: 'sky.lightest', color: 'ink.main' }}
            variant="text"
            onClick={handleSignInGoogle}>
            Đăng nhập với google
          </Button>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
