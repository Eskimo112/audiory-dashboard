// Render Prop
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Clear, HelpOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import { AppImageUpload } from '@/components/app-image-upload';
import { COPYRIGHTS_LIST, MATURE_OPTIONS } from '@/constants/story_options';
import { useAuth } from '@/hooks/use-auth';
import { useRequestHeader } from '@/hooks/use-request-header';
import CategoryService from '@/services/category';
import StoryService from '@/services/story';
import { toastError } from '@/utils/notification';

const StoryForm = () => {
  const router = useRouter();
  const auth = useAuth();
  const jwt = auth?.user.token;
  const requestHeader = useRequestHeader();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tag, setTag] = useState('');
  const [tagList, setTagList] = useState([]);

  const {
    data: categoriesData = [],
    isLoading,
    isSuccess,
  } = useQuery(
    ['categories'],
    async () => await CategoryService(requestHeader).getAll(),
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );
  useEffect(() => {
    setSelectedCategory(categoriesData[0]?.id ?? '');
  }, [categoriesData, isSuccess]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      currentTag: '',
      tags: [],
      category: selectedCategory ?? '',
      isMature: false,
      isCopyright: true,
      formFile: '',
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .min(1, 'Tiêu đề ít nhất 1 ký tự')
        .max(255)
        .required('Bắt buộc nhập tiêu đề'),
      description: Yup.string()
        .trim()
        .min(5, 'Miêu tả ít nhất 5 ký tự')
        .max(1000, 'Miêu tả tối đa 1000 ký tự')
        .required('Miêu tả là bắt buộc'),
      tags: Yup.array().min(1, 'Ít nhất 1 thẻ'),
      formFile: Yup.string().required('Bắt buộc chọn ảnh bìa'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // router.push(`/my-works/1/write/1`);
      } catch (err) {
        console.log('error', err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const TextFieldLabel = ({
    label = 'Tiêu đề',
    isRequired = false,
    hasSuffixIcon = false,
  }) => {
    return (
      <>
        <Grid container direction="row">
          <Grid sx={11} container direction="row">
            <Typography variant="subtitle1" sx={{ color: 'ink.dark' }}>
              {label}
            </Typography>
            {isRequired ? (
              <Typography variant="subtitle1" color="secondary.main">
                {' '}
                *
              </Typography>
            ) : (
              <Typography></Typography>
            )}
          </Grid>
          <Grid sx={1} display="flex" justifyContent="end">
            {hasSuffixIcon ? <HelpOutline /> : <></>}
          </Grid>
        </Grid>
      </>
    );
  };

  const handleCreate = async () => {
    const values = formik.values;
    const body = new FormData();
    body.append('author_id', auth?.user?.id ?? '');
    body.append('category_id', values.category);
    body.append('description', values.description);
    body.append('tags', values.tags);
    body.append('title', values.title);
    body.append('is_mature', values.isMature);
    body.append('is_copyright', values.isCopyright);
    body.append('is_completed', false);
    body.append('is_draft', true);
    body.append('form_file', values.formFile);

    try {
      const data = await StoryService.create({ body, jwt });
      console.log('data', data);
      const storyId = data.id;
      const chapterId = data.chapters[0].id;
      router.push(`/my-works/${storyId}/write/${chapterId}`);
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddTag = (event) => {
    var val = event.target.value.trim();
    if (event.keyCode === 32 && val.trim() !== '') {
      console.log(val);
      if (val.trim().length >= 2) {
        const isDuplicate = tagList.find((ele) => ele === val.trim());
        if (isDuplicate) {
          toastError('Trùng thẻ');
        } else {
          setTagList([...tagList, val.trim()]);
          formik.setFieldValue('tags', tagList);
          console.log(tagList);
        }
      } else {
        toastError('Thẻ ít nhất 2 ký tự');
      }
      val = '';
      setTag(val);
    }
  };
  if (isLoading)
    return (
      <Grid
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <CircularProgress />
      </Grid>
    );

  return (
    <>
      <div>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}>
          <Stack spacing={3}>
            <Grid container spacing={0} sx={{ paddingTop: '2em' }}>
              <Grid xs={8} sx={{ paddingRight: '2em' }}>
                <TextFieldLabel label="Tiêu đề truyện" isRequired={true} />
                <TextField
                  variant="outlined"
                  placeholder="Chưa đặt tên"
                  error={!!(formik.touched.title && formik.errors.title)}
                  fullWidth
                  helperText={formik.touched.title && formik.errors.title}
                  name="title"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  size="small"
                  value={formik.values.title}
                />
                <TextFieldLabel label="Miêu tả truyện" isRequired={true} />
                <TextField
                  multiline={true}
                  minRows={5}
                  maxRows={10}
                  variant="outlined"
                  error={
                    !!(formik.touched.description && formik.errors.description)
                  }
                  fullWidth
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                <TextFieldLabel label="Thể loại" isRequired={true} />
                <TextField
                  fullWidth
                  variant="outlined"
                  select
                  helperText={formik.touched.category && formik.errors.category}
                  name="category"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  size="small"
                  value={formik.values.category || ''}>
                  {categoriesData &&
                    categoriesData?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </TextField>
                <TextFieldLabel label="Thẻ" isRequired={true} />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ngăn cách thẻ bởi dấu cách"
                  type="text"
                  size="small"
                  name="currentTag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e)}
                  helperText={formik.touched.currentTag && formik.errors.tags}
                />
                <Grid container direction="row" sx={{ marginTop: '10px' }}>
                  {tagList.length > 0 &&
                    tagList?.map((tag, index) => (
                      <Box color="secondary" key={index}>
                        <Button
                          variant="outlined"
                          type="button"
                          size="small"
                          sx={{ marginRight: '0.3em', marginBottom: '0.3em' }}>
                          {tag}{' '}
                          <Clear
                            onClick={() => {
                              setTagList(tagList.filter((ele) => ele !== tag));
                            }}
                            fontSize="1em"
                            sx={{ marginLeft: '2em' }}
                          />
                        </Button>
                      </Box>
                    ))}
                </Grid>

                <Grid container spacing={0}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    alignContent="stretch"
                    wrap="wrap">
                    <Grid xs={8}>
                      <TextFieldLabel
                        label="Gắn mác truyện trưởng thành"
                        isRequired={true}
                      />
                    </Grid>
                    <Grid xs={1}>
                      <Switch
                        name="isMature"
                        checked={formik.values.isMature}
                        value={formik.values.isMature}
                        onChange={formik.handleChange}
                        inputProps={{ 'aria-label': '' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography
                    sx={{ backgroundColor: 'secondary' }}
                    variant="subtitle2"
                    color="ink.main">
                    {
                      MATURE_OPTIONS.find(
                        (e) => e.value === formik.values.isMature,
                      )?.content
                    }
                  </Typography>
                </Grid>

                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  alignContent="stretch"
                  wrap="wrap">
                  <Grid>
                    <TextFieldLabel label="Bản quyền" isRequired={true} />
                  </Grid>
                </Grid>
                <Grid container spacing={0}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    name="isCopyright"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    size="small"
                    value={formik.values.isCopyright}>
                    {COPYRIGHTS_LIST.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Typography
                  sx={{ marginTop: 1, backgroundColor: 'secondary' }}
                  variant="subtitle2"
                  color="secondary">
                  {
                    COPYRIGHTS_LIST.find(
                      (e) => e.value === formik.values.isCopyright,
                    )?.content
                  }
                </Typography>
              </Grid>
              <Grid xs={4} spacing={0}>
                <Container maxWidth="lg" height="250px">
                  <AppImageUpload
                    sx={{ width: '20em', height: '30em' }}
                    onChange={(file) => {
                      formik.setFieldValue('formFile', file);
                    }}
                  />
                </Container>
              </Grid>
            </Grid>
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.formFile}
            </Typography>
          )}
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Button
            fullWidth
            sx={{ mt: 3 }}
            disabled={!formik.isValid}
            type="submit"
            variant="contained">
            Tạo
          </Button>
        </form>
      </div>
    </>
  );
};

export default StoryForm;
