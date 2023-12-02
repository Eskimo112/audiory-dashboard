import Head from 'next/head';
import { useRouter } from 'next/navigation';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import * as Yup from 'yup';

import { toastError } from '@/utils/notification';

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
      try {
        await auth.signInWithPassword(values.email, values.password);
        router.push('/my-works');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({
          submit: err.response.data.message ?? 'Tài khoản hoặc mật khẩu sai',
        });
        helpers.setSubmitting(false);
        toastError('Đăng nhập không thành công');
      }
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
        <title>Đăng nhập | Pricible</title>
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

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
              spin>
              {formik.isSubmitting ? 'Đợi chút xíu...' : 'Đăng nhập'}
            </Button>
          </form>

          <Typography variant="body1" color="ink.lighter" textAlign="center">
            Hoặc
          </Typography>
          <Button
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            variant="outlined"
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
