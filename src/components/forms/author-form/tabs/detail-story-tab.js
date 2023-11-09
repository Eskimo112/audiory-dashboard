import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { DeleteOutline, HelpOutline } from "@mui/icons-material";
import { Box, Button, Container, Grid, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { FieldArray, useFormik } from "formik";
import { useQuery } from "react-query";
import * as Yup from 'yup';

import { useAuth } from "@/hooks/use-auth";
import CategoryService from "@/services/category";
import StoryService from "@/services/story";
import { toastError, toastSuccess } from "@/utils/notification";

const DetailStoryTab = ({ story }) => {
    console.log(story?.tags?.map(a => a.name))
    const router = useRouter();
    const auth = useAuth();
    const jwt = auth?.user.token;
    const userId = auth?.user.id;

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tag, setTag] = useState('');
    const [tagList, setTagList] = useState(story?.tags?.map(a => a.name) ?? [])


    const { data: categoriesData = [], isLoading } = useQuery(
        ['categories'],
        async () => await CategoryService.getAll(),
    );

    useEffect(() => {
        setSelectedCategory(categoriesData?.filter((cate) => cate.id === story?.catergory?.id))
    }, [categoriesData])


    const formik = useFormik({
        initialValues: {
            title: story.title,
            description: story.description,
            currentTag: '',
            tags: tagList,
            category: story?.category?.id,
            isDraft: story.is_draft ?? true,
            isMature: story.is_mature ?? false,
            isCopyright: story.is_copyright ?? false,
            isComplete: story.is_complete ?? false,
            formFile: story.cover_url ?? null,
            submit: null,
        },
        // enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string()
                .min(1)
                .max(255),
            description: Yup.string().min(5, 'Ít nhất 5 ký tự').max(1000, 'Tối đa 1000 chữ').required('Miêu tả là bắt buộc'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                handleEdit()
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

    const handleEdit = async () => {
        const values = formik.values;
        var body = new FormData();

        body.append('category_id', values.category);
        body.append('description', values.description);
        body.append('tags', tagList);
        body.append('title', values.title);
        body.append('is_mature', values.isMature);
        body.append('is_copyright', values.isCopyright);
        body.append('is_completed', values.isComplete);
        body.append('is_draft', true);
        // body.append('form_file', values.formFile);

        try {
            await StoryService.edit({ body, storyId: story.id }).then(
                res => {
                    console.log(res)
                    if (res.status === 200) {
                        toastSuccess('Sửa thành công')
                    } else {
                        toastError(res.statusText)
                    }
                }
            );


        } catch (error) {
            console.log('error', error)
        }
    }


    const handleAddTag = (event) => {
        var val = event.target.value;
        if (event.keyCode === 32 && val.trim() !== '') {

            if (val.trim().length >= 2) {
                const isDuplicate = tagList.find((ele) => ele === val.trim());
                if (isDuplicate) {
                    toastError('Trùng thẻ');
                } else {
                    setTagList([...tagList, val.trim()])

                }
            } else {
                toastError('Thẻ ít nhất 2 ký tự')
            }
            val = '';
            setTag(val);
        }
    }
    return (
        <>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Stack direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid width={1 / 2} container direction="row" justifyContent="center">


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
                            maxRows={8}
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
                            type="s"
                            value={formik.values.description}
                        />
                        <TextFieldLabel label='Thể loại' isRequired={true} />
                        <TextField
                            variant="outlined"
                            select
                            fullWidth
                            helperText={formik.touched.category && formik.errors.category}
                            name="category"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            size="small"
                            value={formik.values.category}

                        >
                            {categoriesData?.map((category) => (
                                <MenuItem key={category.id} value={category.id} >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextFieldLabel label='Thẻ' isRequired={true} />
                        <TextField
                            variant="outlined"
                            fullWidth
                            name='currentTag'
                            placeholder='Ngăn cách thẻ bởi dấu cách'
                            type="text"
                            size="small"
                            value={tag}
                            onChange={(e) => { setTag(e.currentTarget.value) }}
                            onKeyDown={(e) => handleAddTag(e)}
                        />
                        {/* <Grid container>
                            {formik.values.tags?.length > 0 && formik.values.tags?.map((tag, index) => (
                                <div key={index}>
                                    {tag.name}
                                    <button type="button" onClick={() => {
                                        formik.setFieldValue('tags', formik.values.tags.filter((e, idx) => index !== idx));
                                    }}>
                                        -
                                    </button>
                                </div>
                            ))}
                        </Grid> */}
                        <Grid container direction="row">
                            {tagList.length > 0 && tagList?.map((tag, index) => (
                                <Box color="ink.main" key={index} >
                                    <Button type="button" >
                                        {tag}  <DeleteOutline onClick={() => {
                                            setTagList(tagList.filter((ele) => ele !== tag))
                                        }} fontSize="1em" sx={{ marginLeft: "2em" }} />
                                    </Button>
                                </Box>


                            ))}
                        </Grid>

                        <Grid
                            container

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
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            alignContent="stretch"
                            wrap="wrap"
                        >
                            <Grid xs={8}>
                                <TextFieldLabel label='Đánh dấu truyện hoàn thành' isRequired={false} />
                            </Grid>
                            <Grid xs={1}>
                                <Switch
                                    name='isComplete'
                                    checked={formik.values.isComplete}
                                    value={formik.values.isComplete}
                                    onChange={formik.handleChange}
                                    inputProps={{ "aria-label": '' }}
                                />
                            </Grid>

                        </Grid>
                        <Grid
                            container
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
                            <Button
                                fullWidth
                                sx={{ mt: 3 }}
                                type="submit"
                                variant="contained"
                                disabled={!formik.isValid || tagList.length < 1}
                            >
                                Sửa
                            </Button>

                        </Grid>

                    </Grid>

                </Stack>
                {formik.errors.submit && (
                    <Typography color="error" sx={{ mt: 3 }} variant="body2">
                        {formik.errors.submit}
                    </Typography>
                )}
            </form>

        </>
    )
}
export default DetailStoryTab;