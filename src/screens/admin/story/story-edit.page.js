import { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { ListRounded } from '@mui/icons-material';
import {
  Avatar,
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
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import { useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { AppImageUpload } from '@/components/app-image-upload';
import { SHARED_PAGE_SX, TABLE_ACTION_BUTTON_SX } from '@/constants/page_sx';
import { useRequestHeader } from '@/hooks/use-request-header';
import CategoryService from '@/services/category';
import StoryService from '@/services/story';
import { toastError, toastSuccess } from '@/utils/notification';

import { SHARED_SELECT_PROPS } from '../dashboard/constant';

const StoryEditPage = ({ storyId }) => {
  const requestHeader = useRequestHeader();
  const router = useRouter();
  const { data: story = {}, isLoading } = useQuery(
    ['stories', storyId],
    async () => await new StoryService(requestHeader).getById(storyId),
  );
  const { data: categories = [] } = useQuery(
    ['categories'],
    async () => await new CategoryService(requestHeader).getAll(),
  );
  const [openDialog, setOpenDialog] = useState();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState();
  // const [tagValue, setTagValue] = useState();
  const formik = useFormik({
    initialValues: {
      category_id: story?.category_id ?? '',
      title: story?.title ?? '',
      description: story?.description ?? '',
      is_draft: story?.is_draft ?? false,
      is_mature: story?.is_mature ?? false,
      is_paywalled: story?.is_paywalled ?? false,
      is_copyright: story?.is_copyright ?? false,
      tags: story?.tags?.map((tag) => tag.name) ?? [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required('Không được để trống'),
      description: Yup.string().required('Không được để trống'),
      tags: Yup.array().required('Không được để trống'),
    }),
    onSubmit: async (values, helpers) => {
      await new StoryService(requestHeader).edit({
        body: {
          category_id: values.category_id,
          title: values.title,
          description: values.description,
          is_draft: values.is_draft,
          is_mature: values.is_draft,
          is_paywalled: values.is_draft,
          is_copyright: values.is_draft,
          tags: values.tags ?? [],
          form_file: selectedFile ?? undefined,
        },
        storyId,
      });
      toastSuccess('Chỉnh sửa thành công');
      queryClient.invalidateQueries({ queryKey: ['stories', storyId] });
    },
  });

  // const canSaveChanges = useMemo(() => {
  //   if (selectedFile) return true;

  //   if (!story) return false;
  //   if (!formik.values) return false;
  //   for (const key of Object.keys(formik.values)) {
  //     if (!formik.values[key] && !story[key]) continue;
  //     if (formik.values[key] !== story[key]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }, [formik.values, story, selectedFile]);

  const handleDeactivate = async () => {
    try {
      if (story?.deleted_date) {
        await new StoryService(requestHeader).activateById(storyId);
        toastSuccess('Đã kích hoạt thành công');
      } else {
        await new StoryService(requestHeader).deactivateById(storyId);
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
        <title>Truyện {story?.title} </title>
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
                <Typography variant="h4">Chỉnh sửa truyện</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={story?.title} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content">
                <Button
                  variant="outlined"
                  color={!story?.deleted_date ? 'error' : 'success'}
                  onClick={() => setOpenDialog(true)}>
                  {!story?.deleted_date ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
                    {!story?.deleted_date ? ' vô hiệu hóa' : 'kích hoạt'} truyện
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
                {/* <Button
                  disabled={!canSaveChanges}
                  variant="contained"
                  onClick={() => formik.handleSubmit()}>
                  Lưu thay đổi
                </Button> */}
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
                        height: '400px',
                      }}>
                      <AppImageUpload
                        defaultUrl={story?.cover_url}
                        onChange={(file) => setSelectedFile(file)}
                      />
                    </Box>

                    <Stack gap="8px" width="100%">
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ cursor: 'pointer' }}>
                        <Avatar
                          src={story.author.avatar_url}
                          sx={{ width: '55px', height: '55px' }}></Avatar>
                        <Stack alignItems="start" flex={1}>
                          <Typography variant="subtitle1">
                            {story.author.full_name ?? 'Không có tên'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontStyle="italic"
                            color="ink.lighter">
                            {story.author.username ?? 'Không có username'}
                          </Typography>
                        </Stack>
                        <Button
                          sx={{ ...TABLE_ACTION_BUTTON_SX }}
                          onClick={() => {
                            router.push(`/admin/users/${story.author.id}`);
                          }}>
                          Chi tiết
                        </Button>
                      </Stack>
                      <Stack>
                        <Stack
                          width="100%"
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Typography
                            variant="subtitle1"
                            fontWeight={400}
                            fontStyle="italic">
                            Lượt đọc
                          </Typography>
                          <Typography variant="subtitle1">
                            {story?.read_count ?? 0}
                          </Typography>
                        </Stack>
                        <Stack
                          width="100%"
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Typography
                            variant="subtitle1"
                            fontWeight={400}
                            fontStyle="italic">
                            Bình chọn
                          </Typography>
                          <Typography variant="subtitle1">
                            {story?.vote_count ?? 0}
                          </Typography>
                        </Stack>
                        <Stack
                          width="100%"
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Typography
                            variant="subtitle1"
                            fontWeight={400}
                            fontStyle="italic">
                            Bình luận
                          </Typography>
                          <Typography variant="subtitle1">
                            {story?.comment_count ?? 0}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Button
                      onClick={() => {
                        router.push(`/admin/stories/${storyId}/chapters`);
                      }}
                      fullWidth
                      variant="outlined"
                      endIcon={
                        <SvgIcon>
                          <ListRounded />
                        </SvgIcon>
                      }>
                      Xem danh sách chương
                    </Button>
                  </Stack>
                </Card>
              </Grid>
              {/* Input information */}
              <Grid xs={12} lg={8}>
                <Card sx={{ padding: 2 }}>
                  <Grid container spacing={3} rowSpacing={2}>
                    <Grid xs={12} lg={6}>
                      <Stack gap={1}>
                        <FormLabel>Id truyện </FormLabel>
                        <TextField
                          disabled
                          fullWidth
                          variant="outlined"
                          type="text"
                          value={story?.id}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack gap={1}>
                        <FormLabel>Thể loại</FormLabel>
                        <Button
                          fullWidth
                          color="inherit"
                          size="small"
                          sx={{ padding: 0 }}>
                          <Select
                            disabled
                            {...SHARED_SELECT_PROPS}
                            fullWidth
                            inputProps={{
                              sx: {
                                padding: '14px 16px',
                                textAlign: 'left',
                              },
                            }}
                            sx={{ padding: 0 }}
                            value={formik.values.category_id}
                            name="category_id"
                            onChange={formik.handleChange}>
                            {categories.map((category) => (
                              <MenuItem key={category.name} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={12}>
                      <Stack gap={1}>
                        <FormLabel>Tên truyện</FormLabel>
                        <TextField
                          disabled
                          error={
                            !!(formik.touched.title && formik.errors.title)
                          }
                          fullWidth
                          helperText={
                            formik.touched.title && formik.errors.title
                          }
                          variant="outlined"
                          name="title"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.title}
                          type="text"
                        />
                      </Stack>
                    </Grid>

                    <Grid xs={12} lg={12}>
                      <Stack gap={1}>
                        <FormLabel>Thẻ</FormLabel>
                        {/* <TextField
                          disabled
                          value={tagValue}
                          onChange={(e) => setTagValue(e.target.value)}
                          fullWidth
                          variant="outlined"
                          name="tag"
                          placeholder="Thêm thẻ cho truyện"
                          onKeyDown={(e) => {
                            if (e.keyCode === 32 || e.keyCode === 13) {
                              setTagValue('');
                              if (
                                formik.values.tags.find(
                                  (t) => t === e.target.value,
                                )
                              )
                                return;
                              formik.setFieldValue('tags', [
                                ...formik.values.tags,
                                e.target.value,
                              ]);
                            }
                          }}
                        /> */}
                        <Stack direction="row" gap="6px" flexWrap="wrap">
                          {formik.values.tags?.map((tag, index) => (
                            <Box
                              key={index}
                              sx={{
                                bgcolor: 'primary.lightest',
                                p: '4px 8px',
                                borderRadius: 1,
                                fontSize: '12px',
                                wrap: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}>
                              {tag}
                              {/* <SvgIcon
                                sx={{
                                  width: '14px',
                                  color: 'ink.lighter',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  formik.setFieldValue(
                                    'tags',
                                    formik.values.tags.filter((t) => t !== tag),
                                  );
                                }}>
                                <Close />
                              </SvgIcon> */}
                            </Box>
                          ))}
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
                    <Grid xs={12} lg={6}>
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
                            Chỉ người dùng trưởng thành có thể thấy truyện này
                          </Typography>
                        </Stack>
                        <Switch
                          disabled
                          color="primary"
                          checked={formik.values.is_mature}
                          onChange={(e) =>
                            formik.setFieldValue('is_mature', e.target.checked)
                          }
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack
                        width="100%"
                        direction="row"
                        gap="4px"
                        alignItems="center"
                        justifyContent="space-between">
                        <Stack>
                          <Typography variant="subtitle1" fontWeight="600">
                            Đã xuất bản
                          </Typography>
                          {/* <Typography
                            variant="subtitle1"
                            fontSize="12px"
                            color="ink.lighter">
                            Tắt nút này sẽ đưa truyện về bản nháp
                          </Typography> */}
                        </Stack>
                        <Switch
                          disabled
                          color="primary"
                          name="is_draft"
                          checked={!formik.values.is_draft}
                          onChange={(e) => {
                            formik.setFieldValue('is_draft', !e.target.checked);
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack
                        width="100%"
                        direction="row"
                        gap="4px"
                        alignItems="center"
                        justifyContent="space-between">
                        <Stack>
                          <Typography variant="subtitle1" fontWeight="600">
                            Truyện bản quyền
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontSize="12px"
                            color="ink.lighter">
                            Không thể chỉnh sửa
                          </Typography>
                        </Stack>
                        <Switch
                          disabled
                          color="primary"
                          checked={formik.values.is_copyright}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={12} lg={6}>
                      <Stack
                        width="100%"
                        direction="row"
                        gap="4px"
                        alignItems="center"
                        justifyContent="space-between">
                        <Stack>
                          <Typography variant="subtitle1" fontWeight="600">
                            Truyện trả phi
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontSize="12px"
                            color="ink.lighter">
                            Không thể chỉnh sửa
                          </Typography>
                        </Stack>
                        <Switch
                          disabled
                          name="is_paywalled"
                          color="primary"
                          checked={formik.values.is_paywalled}
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

export default StoryEditPage;
