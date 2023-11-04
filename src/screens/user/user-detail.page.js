import Head from 'next/head';

import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import AppBreadCrumbs from '../../components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '../../constants/page_sx';
import UserService from '../../services/user';

const UserDetaiPage = ({ userId }) => {
  const { data: user, isLoading } = useQuery(
    ['users', userId],
    async () => await UserService.getById(userId),
  );

  const formik = useFormik({
    initialValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      id: user?.id ?? '',
      full_name: user?.full_name ?? '',
      description: user?.description ?? '',
      active: user?.is_enabled ?? false,
      can_show_mature: user?.can_show_mature ?? false,
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
        <title>User {user?.username} </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Chỉnh sửa hồ sơ</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs />
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
                        maxRows={5}
                        variant="outlined"
                        label="Giới thiệu"
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
                  <Stack justifyContent="center" alignItems="center">
                    <Avatar
                      src={user?.avatar_url}
                      sx={{
                        width: '80%',
                        height: 'auto',
                        marginBottom: '12px',
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight={400}>
                      Người theo dõi: <b>{user?.number_of_followers ?? 0} </b>
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={400}>
                      Tác giả: <b> cấp {user?.author_level_id ?? 0} </b>
                    </Typography>
                    <Stack
                      width="100%"
                      direction="row"
                      gap="4px"
                      alignItems="center"
                      justifyContent="space-between">
                      <Stack>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Vô hiệu hóa
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontSize="12px"
                          color="ink.lighter">
                          Vô hiệu hóa tài khoản người dùng
                        </Typography>
                      </Stack>
                      <Switch
                        color="primary"
                        defaultChecked={formik.values.active}
                        onChange={(value) =>
                          formik.setFieldValue('active', value)
                        }
                      />
                    </Stack>
                    <Stack
                      width="100%"
                      direction="row"
                      gap="4px"
                      alignItems="center"
                      justifyContent="space-between">
                      <Stack>
                        <Typography variant="subtitle1" fontWeight="600">
                          Nội dung trưởng thành
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontSize="12px"
                          color="ink.lighter">
                          Người dùng có thể thấy nội dung trưởng thành
                        </Typography>
                      </Stack>
                      <Switch
                        color="primary"
                        defaultChecked={formik.values.can_show_mature}
                        onChange={(value) =>
                          formik.setFieldValue('can_show_mature', value)
                        }
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

export default UserDetaiPage;
