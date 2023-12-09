import { useState } from 'react';

import Head from 'next/head';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
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
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';

import { toastError, toastSuccess } from '../../../utils/notification';
import UserStoriesTable from './user-stories-table';
import UserTransactionsTable from './user-transaction-table';

const UserDetaiPage = ({ userId }) => {
  const requestHeader = useRequestHeader();
  const {
    data: user = {},
    isLoading,
    refetch,
  } = useQuery(
    ['users', userId],
    async () => await new UserService(requestHeader).getById(userId),
  );
  const [selectedFile, setSelectedFile] = useState();
  const [openDialog, setOpenDialog] = useState();

  const formik = useFormik({
    initialValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      id: user?.id ?? '',
      full_name: user?.full_name ?? '',
      description: user?.description ?? '',
      is_enabled: user?.is_enabled ?? false,
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

  const handleDeactivate = async () => {
    try {
      if (user?.deleted_date) {
        await new UserService(requestHeader).activateById(userId);
        toastSuccess('Đã kích hoạt thành thành công');
      } else {
        await new UserService(requestHeader).deactivateById(userId);
        toastSuccess('Đã vô hiệu hóa thành công');
      }
      refetch();
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    setOpenDialog(false);
  };

  // const canSaveChanges = useMemo(() => {
  //   if (selectedFile) return true;

  //   if (!user) return false;
  //   if (!formik.values) return false;
  //   for (const key of Object.keys(formik.values)) {
  //     if (!formik.values[key] && !user[key]) continue;
  //     if (formik.values[key] !== user[key]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }, [formik.values, user, selectedFile]);

  if (isLoading) return <CircularProgress />;
  return (
    <>
      <Head>
        <title>User {user?.username} </title>
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
                <Typography variant="h4">Chỉnh sửa hồ sơ</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={user?.username} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content">
                <Button
                  variant="outlined"
                  color={!user?.deleted_date ? 'error' : 'success'}
                  onClick={() => setOpenDialog(true)}>
                  {!user?.deleted_date ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
                    {!user?.deleted_date ? ' vô hiệu hóa' : 'kích hoạt'} người
                    dùng này?
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
                {/* <Button disabled={!canSaveChanges} variant="contained">
                  Lưu thay đổi
                </Button> */}
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={8}>
                <Card sx={{ padding: 2 }}>
                  <CardHeader
                    sx={{ padding: 0, pb: '16px' }}
                    title={`Thông tin`}
                  />
                  <Grid container spacing={3}>
                    <Grid xs={12} lg={6}>
                      <Stack gap={2}>
                        <Stack gap={1}>
                          <FormLabel>Id người dùng</FormLabel>

                          <TextField
                            disabled
                            fullWidth
                            helperText={formik.touched.id && formik.errors.id}
                            variant="outlined"
                            name="id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.id}
                          />
                        </Stack>
                        <Stack gap={1}>
                          <FormLabel>Họ và tên</FormLabel>
                          <TextField
                            disabled
                            error={
                              !!(
                                formik.touched.full_name &&
                                formik.errors.full_name
                              )
                            }
                            fullWidth
                            helperText={
                              formik.touched.full_name &&
                              formik.errors.full_name
                            }
                            variant="outlined"
                            name="full_name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.full_name}
                            type="text"
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack gap={2}>
                        <Stack gap={1}>
                          <FormLabel>Tên người dùng</FormLabel>
                          <TextField
                            disabled
                            error={
                              !!(
                                formik.touched.username &&
                                formik.errors.username
                              )
                            }
                            fullWidth
                            helperText={
                              formik.touched.username && formik.errors.username
                            }
                            variant="outlined"
                            name="username"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.username}
                          />
                        </Stack>
                        <Stack gap={1}>
                          <FormLabel>Email</FormLabel>
                          <TextField
                            disabled
                            error={
                              !!(formik.touched.email && formik.errors.email)
                            }
                            fullWidth
                            helperText={
                              formik.touched.email && formik.errors.email
                            }
                            variant="outlined"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={12}>
                      <Stack gap={1}>
                        <FormLabel>Giới thiệu</FormLabel>
                        <TextField
                          disabled
                          fullWidth
                          multiline
                          minRows={5}
                          maxRows={5}
                          variant="outlined"
                          name="description"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="text"
                          value={formik.values.description}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid xs={12} lg={4}>
                <Card sx={{ padding: 2 }}>
                  <CardHeader
                    sx={{ padding: 0, pb: '16px' }}
                    title={`Ảnh đại diện & cài đặt`}
                  />
                  <Stack justifyContent="center" alignItems="center" gap="12px">
                    <Avatar
                      sx={{ width: '90%', aspectRatio: 1, height: '100%' }}
                      src={user?.avatar_url}></Avatar>

                    <Stack justifyContent="center" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={400}>
                        Người theo dõi: <b>{user?.number_of_followers ?? 0} </b>
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={400}>
                        Tác giả: <b> {user?.author_level.name ?? 0} </b>
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={400}>
                        Thành viên: <b> {user?.level.name ?? 0} </b>
                      </Typography>
                    </Stack>

                    {/* <Stack
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
                    </Stack> */}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Stack>
          <Grid container spacing={2}>
            <Grid xs={12} lg={6}>
              <Card sx={{ padding: 2 }}>
                <CardHeader
                  sx={{ padding: 0, pb: '16px' }}
                  title={`Truyện của ${user.username}`}
                />
                <UserStoriesTable userId={userId} />
              </Card>
            </Grid>
            <Grid xs={12} lg={6}>
              <Card sx={{ padding: 2 }}>
                <CardHeader
                  sx={{ padding: 0, pb: '16px' }}
                  title={`Giao dịch của ${user.username}`}
                />
                <UserTransactionsTable userId={userId} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default UserDetaiPage;
