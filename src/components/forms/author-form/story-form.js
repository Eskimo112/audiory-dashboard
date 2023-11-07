// Render Prop
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { CloudUpload, HelpOutline } from '@mui/icons-material';
import { Button, Card, CircularProgress, Grid, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { FieldArray, useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import { AppImageUpload } from '@/components/app-image-upload';
import { useAuth } from '@/hooks/use-auth';
import CategoryService from '@/services/category';
import StoryService from '@/services/story';
import { toastError } from '@/utils/notification';

const StoryForm = () => {
    const router = useRouter();
    const auth = useAuth();
    const jwt = auth.user.token;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tag, setTag] = useState('');
    const { data: categoriesData, isLoading, isSuccess } = useQuery(
        ['categories'],
        async () => await CategoryService.getAll(),
    );
    useEffect(() => {

        setCategories(categoriesData);
        setSelectedCategory(isSuccess ? categoriesData[0].id : '');


    }, [categoriesData])

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            currentTag: '',
            tags: [],
            category: selectedCategory,
            isMature: false,
            isCopyright: false,
            formFile: null,
            submit: null,
        },
        // enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().trim()
                .min(1, 'Tiêu đề ít nhất 1 ký tự')
                .max(255).required('Bắt buộc nhập tiêu đề'),
            description: Yup.string().trim().min(1, 'Miêu tả ít nhất 1 ký tự').max(500, 'Miêu tả tối đa 500 ký tự').required('Miêu tả là bắt buộc'),
            tags: Yup.array().min(1, 'Ít nhất 1 thẻ')
        }),
        onSubmit: async (values, helpers) => {
            try {

                // router.push(`/my-works/1/write/1`);
            } catch (err) {
                console.log('error', err)
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },

    });

    const TextFieldLabel = ({ label = 'Tiêu đề', isRequired = false, hasSuffixIcon = false }) => {
        return (
            <>
                <Grid container direction='row' >
                    <Grid sx={11} container direction='row'>
                        <Typography variant='subtitle1' sx={{ color: 'ink.dark' }}>{label}</Typography>
                        {isRequired ? <Typography variant="subtitle1" color="secondary.main"> *</Typography> : <Typography></Typography>}
                    </Grid>
                    <Grid sx={1} display="flex" justifyContent="end">
                        {hasSuffixIcon ? <HelpOutline /> : <></>}
                    </Grid>
                </Grid>
            </>
        );
    }

    const handleCreate = async () => {
        const values = formik.values;
        var body = new FormData();
        body.append('author_id', auth.user?.id ?? '');
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
            toastError(error)
        }
    }

    const handleAddTag = (event) => {
        var val = event.target.value;
        console.log(val, 'code ', event.keyCode)
        if (event.keyCode === 32 && val.trim() !== '') {

            console.log(formik.values.tags.filter((ele) => ele.name === val.trim()))
            const isDuplicate = formik.values.tags.filter((ele) => ele.name === val.replace(',', '').trim()).length > 0;
            if (isDuplicate) {
                toastError('Trùng thẻ');
            } else {
                formik.setFieldValue('tags', [...formik.values.tags, { name: val.trim() }]);
            }
            val = '';
            console.log(val)
            setTag('');

        };
    }
    if (isLoading)
        return (
            <Card
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '500px',
                }}>
                <CircularProgress />
            </Card>
        );

    return (
        <>
            <div>
                <form noValidate onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
                    <Stack spacing={3} >
                        <Grid container spacing={0} sx={{ paddingTop: '2em' }}>
                            <Grid xs={8} sx={{ paddingRight: '2em' }}>
                                <TextFieldLabel label='Tiêu đề truyện' isRequired={true} />
                                <TextField
                                    variant="outlined"
                                    placeholder='Chưa đặt tên'
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
                                <TextFieldLabel label='Miêu tả truyện' isRequired={true} />
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
                                    type=""
                                    value={formik.values.description}
                                />
                                <TextFieldLabel label='Thể loại' isRequired={true} />
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
                                    value={formik.values.category}

                                >
                                    {categories && categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextFieldLabel label='Thẻ' isRequired={true} />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder='Ngăn cách thẻ bởi dấu cách'
                                    type="text"
                                    size="small"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    onKeyDown={(e) => handleAddTag(e)}
                                />
                                <Grid container>
                                    {formik.values.tags.length > 0 && formik.values.tags.map((tag, index) => (
                                        <div key={index}>
                                            {tag.name}
                                            <button type="button" onClick={() => {
                                                formik.setFieldValue('tags', formik.values.tags.filter((e, idx) => index !== idx));
                                            }}>
                                                -
                                            </button>
                                        </div>
                                    ))}
                                </Grid>



                                {({ values }) => (
                                    <FieldArray name='tags' render={arrayHelpers => {

                                        <div>
                                            {formik.values.tags.length > 0 && values.tags.map((tag, index) => (
                                                <div key={index}>
                                                    {tag.name}

                                                    <button type="button" onClick={() => arrayHelpers.remove(index)}>
                                                        -
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => arrayHelpers.push({ name: 'milu' })}
                                            >
                                                +
                                            </button>
                                            alo
                                        </div>
                                    }} />
                                )}
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    alignContent="stretch"
                                    wrap="wrap"

                                >
                                    <Grid xs={8}>
                                        <TextFieldLabel label='Gắn mác truyện trưởng thành' isRequired={true} />
                                    </Grid>
                                    <Grid xs={1}>
                                        <Switch
                                            name='isMature'
                                            checked={formik.values.isMature}
                                            value={formik.values.isMature}
                                            onChange={formik.handleChange}
                                            inputProps={{ "aria-label": '' }}
                                        />
                                    </Grid>

                                </Grid>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    alignContent="stretch"
                                    wrap="wrap"
                                >
                                    <Grid xs={8}>
                                        <TextFieldLabel label='Bản quyền' isRequired={true} />
                                    </Grid>
                                    <Grid xs={1}>
                                        <Switch
                                            name='isCopyright'
                                            value={formik.values.isCopyright}
                                            checked={formik.values.isCopyright}
                                            onChange={formik.handleChange}
                                            inputProps={{ "aria-label": '' }}
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid xs={4} spacing={0}>
                                <AppImageUpload onChange={(file) => { formik.setFieldValue('form_file', file) }} />


                            </Grid>
                        </Grid>


                    </Stack>
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
    )

};

export default StoryForm;