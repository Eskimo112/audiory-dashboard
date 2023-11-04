// Render Prop
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { CloudUpload, HelpOutline } from '@mui/icons-material';
import { Button, Grid, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { FieldArray, useFormik } from 'formik';
import * as Yup from 'yup';

import CategoryService from '@/services/category';
import StoryService from '@/services/story';

const StoryForm = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tag, setTag] = useState('');
    useEffect(() => {
        CategoryService.getAll().then((res) => {
            setCategories(res);
            setSelectedCategory(res[0].id);
        });

    }, [])

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            currentTag: '',
            tags: [{ name: 'tag1' }, { name: 'tag2' }],
            category: selectedCategory,
            isMature: false,
            isCopyright: false,
            formFile: null,
            submit: null,
        },
        // enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string()
                .min(1)
                .max(255),
            description: Yup.string().min(1).max(255).required('Miêu tả là bắt buộc'),
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
        body.append('author_id', '55e181ba-4ee7-11ee-b742-0242c0a8b002');
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
            const data = await StoryService.create(body);
            console.log('data', data);
            const storyId = data.id;
            const chapterId = data.chapters[0].id;
            router.push(`/my-works/${storyId}/write/${chapterId}`);

        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            <div>

                <form noValidate onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
                    <Stack spacing={3}>
                        <Grid container spacing={0}>
                            <Grid xs={8} spacing={0}>
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
                                <TextFieldLabel label='Miêu tả truyện' isRequired={false} />
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
                                    variant="outlined"
                                    select
                                    defaultValue={selectedCategory}
                                    helperText={formik.touched.category && formik.errors.category}
                                    name="category"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    size="small"
                                    value={formik.values.category}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextFieldLabel label='Thẻ' isRequired={true} />
                                <TextField
                                    variant="outlined"
                                    placeholder='Ngăn cách thẻ bởi dấu cách'
                                    error={!!(formik.touched.currentTag && formik.errors.currentTag)}
                                    helperText={formik.touched.currentTag && formik.errors.currentTag}
                                    name="currentTag"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    size="small"
                                    value={tag}
                                    sx={{ width: 1 / 2 }}
                                />

                                <Grid container>
                                    {formik.values.tags.length > 0 && formik.values.tags.map((tag, index) => (
                                        <div key={index}>
                                            {tag.name}

                                            <button type="button" onClick={() => {
                                                formik.values.tags.remove();
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
                                        <TextFieldLabel label='Cảnh báo truyện trưởng thành' isRequired={true} />
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
                                <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                                    Upload file
                                    <TextField onChange={(e) => {
                                        e.preventDefault();
                                        formik.setFieldValue('formFile', e.currentTarget.files[0])
                                    }} inputProps={{ accept: '.jpg,.jpeg,.png' }} hidden type="file" />
                                </Button>


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