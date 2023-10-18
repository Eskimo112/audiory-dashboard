import Head from 'next/head';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  OutlinedInput,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import UserService from '../../services/user';

const UserEditPage = ({ userId }) => {
  const { data: user, isLoading } = useQuery(
    ['users', userId],
    async () => await UserService.getById(userId),
  );

  console.log('render');

  const formik = useFormik({
    initialValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      id: user?.id ?? '',
      full_name: user?.full_name ?? '',
      description: user?.description ?? '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Vui lòng nhập đúng định dạng email').max(255),
      username: Yup.string().max(255).required('Tên người dùng là bắt buộc'),
      full_name: Yup.string().max(255).required('Họ và tên là bắt buộc'),
    }),
    onSubmit: async (values, helpers) => {
      //   try {
      //     await auth.signIn(values.email, values.password);
      //     router.push('/');
      //   } catch (err) {
      //     helpers.setStatus({ success: false });
      //     helpers.setErrors({ submit: err.message });
      //     helpers.setSubmitting(false);
      //   }
    },
  });
  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Head>
        <title>Users {user?.username} | Audiory</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Chỉnh sửa hồ sơ</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  //   startIcon={
                  //     <SvgIcon fontSize="small">
                  //       <PlusIcon />
                  //     </SvgIcon>
                  //   }
                  variant="contained">
                  Lưu thay đổi
                </Button>
              </div>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={8}>
                <Card sx={{ padding: 2 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} lg={6}>
                      <Stack gap={2}>
                        <TextField
                          disabled
                          fullWidth
                          helperText={formik.touched.id && formik.errors.id}
                          variant="outlined"
                          label="Id"
                          name="id"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="text"
                          value={formik.values.id}
                        />
                        <TextField
                          error={
                            !!(
                              formik.touched.full_name &&
                              formik.errors.full_name
                            )
                          }
                          fullWidth
                          helperText={
                            formik.touched.full_name && formik.errors.full_name
                          }
                          variant="outlined"
                          label="Họ và tên"
                          name="full_name"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.full_name}
                          type="text"
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack gap={2}>
                        <TextField
                          error={
                            !!(
                              formik.touched.username && formik.errors.username
                            )
                          }
                          fullWidth
                          helperText={
                            formik.touched.username && formik.errors.username
                          }
                          variant="outlined"
                          label="Tên người dùng"
                          name="username"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.username}
                          //   type="text"
                        />
                        <TextField
                          error={
                            !!(formik.touched.email && formik.errors.email)
                          }
                          fullWidth
                          helperText={
                            formik.touched.email && formik.errors.email
                          }
                          variant="outlined"
                          label="Email"
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="email"
                          value={formik.values.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        label="Description"
                        name="description"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.description}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid xs={12} lg={4}>
                <Card sx={{ padding: 2 }}>
                  <Stack justifyContent="center" alignItems="center" gap="8px">
                    <Avatar
                      src={user?.avatar_url}
                      sx={{ width: '100px', height: '100px' }}
                    />
                    <Typography variant="subtitle1" fontStyle="italic">
                      <b>{user?.number_of_followers ?? 0} </b> follower
                    </Typography>
                    <Typography variant="subtitle1" fontStyle="italic">
                      Tác giả <b> cấp {user?.author_level_id ?? 0} </b>
                    </Typography>
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

export default UserEditPage;
