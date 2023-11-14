
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import { Box, Card, CircularProgress, Container, Divider, MenuItem, Popover, Skeleton, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ChapterVersionService from '@/services/chapter-version';
import { useRouter } from 'next/router';
import ChapterService from '@/services/chapter';
import { useQuery } from 'react-query';
import { useAuth } from '@/hooks/use-auth';
import { toastError, toastSuccess } from '@/utils/notification';
import { AppImageUpload } from '@/components/app-image-upload';
import AuthorBreadcrum from '@/layouts/author/bread-crum';
import AuthorBreadCrumbs from '@/components/author-bread-crumbs';
import { CheckBoxSharp, CheckCircle } from '@mui/icons-material';
import { formatDate } from '@/utils/formatters';

const toolbarOptions = [
    ['bold', 'italic', 'underline'],        // toggled buttons


    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    // [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['image'],          // add's image support

    [{ 'font': [] }],
    [{ 'align': [] }],

];
const MIN_WORDS = 5;
const NewChapterPage = () => {
    const router = useRouter();

    const storyId = router.query.id;
    const chapterId = router.query['chapter-id'];

    const auth = useAuth();
    const jwt = auth?.user.token;

    const { data: chapterData = {}, isLoading, isSuccess, refetch, isRefetching } = useQuery(
        ['chapter'],
        async () => await ChapterService.getById({ chapterId, jwt }),
    );

    const { data: chapterVersionsData = [], isSucces2, refetch: refetch2 } = useQuery(
        ['chapterVersionList'],
        async () => await ChapterVersionService.getAll({ chapterId, jwt }),

    );

    const [currentChapterVersion, setCurrentChapterVersion] = useState({});
    const [value, setValue] = useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event, storyData) => {
        setStoryData(storyData);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [storyData, setStoryData] = useState({});


    useEffect(() => {
        setCurrentChapterVersion(chapterData?.current_chapter_version);

    }, [chapterData, chapterVersionsData])
    useEffect(() => {
        setCurrentChapterVersion(chapterData?.current_chapter_version);
        refetch();
        refetch2();
    }, [router])
    console.log('chapterData');
    console.log('chapterVersionData')

    const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
    const formik = useFormik({
        initialValues: {
            chapter_id: chapterId,
            content: chapterData?.current_chapter_version?.content ?? '',
            rich_text: chapterData?.current_chapter_version?.rich_text === "" || chapterData?.current_chapter_version?.rich_text === undefined ? '{}' : chapterData?.current_chapter_version?.rich_text,
            title: chapterData?.current_chapter_version?.title ?? '',
            version_name: '',
            form_file: '',
            isSubmit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().trim()
                .min(1, 'Tiêu đề ít nhất 1 ký tự')
                .max(255).required('Bắt buộc nhập tiêu đề'),
        }),
        onSubmit: async (values, helpers) => {
            try {
            } catch (error) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: error.message });
                helpers.setSubmitting(false);
            }
        }
    })

    const onEditorChange = (content, delta, source, editor) => {
        console.log('size', new Blob(editor.getContents()))
        console.log('EDITor', editor.getContents().ops); // rich_text
        console.log('EDITor', JSON.stringify(editor.getContents().ops)); // rich_text
        console.log('Text', editor.getText()); // content
        console.log('content ', content);
        console.log('richtext', formik.values.rich_text);
        console.log('CHARACTERS COUNT', editor.getLength())
        console.log('IMAGES', editor.getContents().ops?.filter(ele => ele.insert.image !== undefined)?.map((image) => image?.insert?.image));// get base 64 array for image moderation

        setValue(editor.getText().trim())
        formik.setFieldValue('rich_text', JSON.stringify(editor.getContents()));
        formik.setFieldValue('content', editor.getText())
    }

    const renderCustomToolbar = () => {
        return (
            <span className='ql-formats'>
                <button className='ql-bold' aria-label='Bold'></button>
                <button className='ql-italic' aria-label='Italic'></button>
                <button className='ql-underline' aria-label='Underline'></button>
            </span>
        )
    }

    const onPublishChapter = () => {
        console.log(value.split(' ').length)
        if (value.split(' ').length < MIN_WORDS) {
            toastError('Quá ngắn để lưu bản thảo')
        } else {
            // onSaveDraftChapter();
            // if (formik.values.content.replace('\n') === '') {
            //     toastError('Nội dung quá ngắn');

            // } else {
            try {
                ChapterService.publish(chapterId).then(res => {
                    if (res.code === 200) {
                        toastSuccess('Đăng tải thành công')
                    } else {
                        toastError(res.message);
                    }
                })

            } catch (error) {
                toastError('Đăng tải không thành công')
            }
            // }
        }
    }

    const onSaveDraftChapter = async (isPreview, isPublish) => {
        if (value.split(' ').length < MIN_WORDS) {
            toastError(`Quá ngắn để lưu bản thảo`)
        } else {
            // create chapter version
            const values = formik.values;
            const formData = new FormData();
            Object.keys(values).forEach(key => formData.append(key, values[key]));
            console.log('body', formData)
            try {
                await ChapterVersionService.create({ body: formData, jwt }).then(res => {
                    if (res.code === 200) {
                        if (isPreview) {
                            console.log('pre');
                            refetch2().then(res => {
                                console.log(res);
                                router.replace(`/my-works/${router.query?.id}/preview/${chapterVersionsData[chapterVersionsData.length - 1].id}`)

                            });

                        } else if (isPublish) {
                            try {
                                ChapterService.publish(chapterId).then(res => {
                                    if (res.code === 200) {
                                        toastSuccess('Đăng tải thành công')
                                    } else {
                                        toastError(res.message);
                                    }
                                })
                            } catch (error) {
                                toastError('Đăng tải không thành công')
                            }
                        } else {
                            toastSuccess('Lưu bản thảo thành công');
                            refetch2();
                        }



                    } else {
                        toastError(res.message);
                    }
                });

            } catch (error) {
                console.log(error)
            }
        }


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
            <Stack direction="column" justifyContent="center" alignItems="center">

                <Grid width={1 / 2}>
                    {isRefetching ? <Skeleton /> : <AuthorBreadCrumbs storyGenerator={true} chapterTitle={` ${chapterData?.title ?? 'Tiêu đề chương'}`} handleOpen={handleClick} />}

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onBlur={handleClose}

                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        sx={{ maxHeight: "25em" }}

                    >
                        <Grid container direction="column" >
                            {storyData && storyData?.chapters?.map((chapter, index) => (
                                <Button key={chapter?.id} spacing={0} sx={{ minWidth: "30em", maxWidth: "25em", display: 'flex', direction: "row", border: "none", borderBottom: "0.5px solid #F1EFEF", padding: "0.6em 1.2em" }} onClick={(e) => {
                                    console.log(`/my-works/${storyId}/write/${chapterId}`);
                                    router.push(`/my-works/${storyData?.id}/write/${chapter?.id}`);

                                }}>
                                    <Grid xs={10} container spacing={0}>
                                        <Grid container spacing={0} direction="row" justifyContent="flex-start">
                                            <Typography sx={{ fontWeight: "bold" }} variant="subtitle1" color="ink.main">Chương {index + 1} -</Typography>
                                            <Typography noWrap sx={{ fontWeight: "bold", textAlign: "start", width: "12em", textOverflow: "ellipsis" }} variant="subtitle1" color="ink.main">{chapter?.title ?? ' Tiêu đề'}</Typography>
                                        </Grid>
                                        <Grid container spacing={0} direction="row" columnGap="0.2em">
                                            <Typography color={chapter?.is_draft ? 'ink.lighter' : 'primary'} variant="body1" >({chapter?.is_draft ? 'Bản thảo' : 'Đã đăng tải'}) </Typography>
                                            <Typography variant="body1" color="sky.dark">{`${formatDate(chapter?.updated_date ?? chapter?.created_date).split(' ')[0]}`}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={2} container justifyContent="end" alignItems="center">
                                        {chapterData && chapterData?.id === chapter.id ? <CheckCircle color='primary' fontSize='medium' /> : <></>}
                                    </Grid>
                                </Button>
                            ))}
                        </Grid>
                    </Popover>
                </Grid></Stack>


            <Stack direction="column" justifyContent="center" alignItems="center">
                <Grid width={1 / 2}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ margin: "1em 0" }}
                    >
                        <Grid xs={5} container spacing={0}>
                            <TextField
                                variant="outlined"
                                select
                                placeholder='Chọn chapter'
                                onBlur={formik.handleBlur}
                                type="text"
                                size="small"
                                value={currentChapterVersion?.id ?? ''}

                            >
                                {chapterVersionsData && chapterVersionsData?.sort((a, b) => a?.created_date > b?.created_date).map((category, index) => (
                                    <MenuItem key={index} value={category.id} onClick={() => {
                                        router.push(`/my-works/${router.query?.id}/preview/${category.id}`)
                                    }}>
                                        {category.version_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid
                            xs={7}
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="end"
                            alignContent="flex-end"
                            columnGap="0.2em"
                        >

                            <Button disabled={!formik.isValid} variant="contained" color="primary" onClick={() => { onSaveDraftChapter(false, true) }}>
                                Đăng tải
                            </Button>
                            <Button disabled={!formik.isValid} variant="outlined" color="inherit" onClick={() => { onSaveDraftChapter(false, false) }}>
                                Lưu bản thảo
                            </Button>
                            <Button disabled={!formik.isValid} variant="outlined" color="inherit" onClick={() => { onSaveDraftChapter(true, false) }} >
                                Xem trước
                            </Button>
                        </Grid>

                    </Grid>

                    <Grid maxWidth="lg">
                        <form noValidate onSubmit={formik.handleSubmit}>
                            {isRefetching ? <Skeleton /> : <AppImageUpload defaultUrl={currentChapterVersion?.banner_url} onChange={(file) => { formik.setFieldValue('form_file', file) }} />}
                            <TextField
                                variant="standard"
                                placeholder='Đặt tên cho chương'
                                inputProps={{ min: 1, style: { textAlign: 'center', fontSize: '1.2em', marginTop: "1em" } }}
                                error={!!(formik.touched.title && formik.errors.title)}
                                fullWidth
                                name="title"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                size="large"
                                value={formik.values.title || ''}
                            />

                        </form>
                    </Grid>

                    <Container sx={{ marginTop: "2em" }} >
                        {formik.values.rich_text === "" ? <></> : <ReactQuill sx={{ border: "none" }} modules={{
                            toolbar: toolbarOptions,

                        }} value={JSON.parse(formik.values.rich_text === '' ? '{}' : formik.values.rich_text)} placeholder='Viết gì đó' onChange={onEditorChange} theme='snow' />}
                    </Container>



                </Grid>

            </Stack>
        </>
    );
};

export default NewChapterPage;