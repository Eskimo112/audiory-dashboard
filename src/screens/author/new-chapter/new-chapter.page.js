
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import { Card, CircularProgress, Container, MenuItem, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CloudUpload } from '@mui/icons-material';
import ChapterVersionService from '@/services/chapter-version';
import { useRouter } from 'next/router';
import ChapterService from '@/services/chapter';
import StoryService from '@/services/story';
import { useQuery } from 'react-query';
import { useAuth } from '@/hooks/use-auth';
import { toastError, toastSuccess } from '@/utils/notification';
import { AppImageUpload } from '@/components/app-image-upload';

const toolbarOptions = [
    ['bold', 'italic', 'underline'],        // toggled buttons


    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['image'],          // add's image support

    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];
const MIN_WORDS = 5;
const NewChapterPage = () => {

    const router = useRouter();
    const storyId = router.query.id;
    const chapterId = router.query['chapter-id'];

    const auth = useAuth();
    const jwt = auth?.user.token;

    const { data: chapterData = {}, isLoading, isSuccess } = useQuery(
        ['chapter'],
        async () => await ChapterService.getById({ chapterId, jwt }),
    );

    const { data: chapterVersionsData = [], isSucces2, refetch } = useQuery(
        ['chapterVersionList'],
        async () => await ChapterVersionService.getAll({ chapterId, jwt }),

    );

    const [currentChapterVersion, setCurrentChapterVersion] = useState({});
    const [value, setValue] = useState('');

    useEffect(() => {
        setCurrentChapterVersion(chapterData?.current_chapter_version);
    }, [chapterData, chapterVersionsData])

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
        console.log('EDITor', editor.getContents().ops); // rich_text
        console.log('EDITor', JSON.stringify(editor.getContents().ops)); // rich_text
        console.log('Text', editor.getText()); // content
        console.log('content ', content);
        console.log('richtext', formik.values.rich_text);
        console.log('CHARACTERS COUNT', editor.getLength())

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
                            refetch().then(res => {
                                console.log(res);
                                // router.push(`/my-works/${router.query?.id}/preview/${chapterVersionsData[chapterVersionsData.length - 1].id}`)

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
                            refetch();
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
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                sx={{ paddingTop: "2em", columnGap: "0.5em" }}
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

            <Stack direction="column" justifyContent="center" alignItems="center">
                <Grid width={1 / 2}>
                    <TextField
                        variant="outlined"
                        select
                        placeholder='Chọn chapter'
                        onBlur={formik.handleBlur}
                        type="text"
                        size="small"
                        value={currentChapterVersion?.id ?? ''}
                        sx={{ margin: "1em 0" }}

                    >
                        {chapterVersionsData && chapterVersionsData?.sort((a, b) => a?.created_date > b?.created_date).map((category, index) => (
                            <MenuItem key={index} value={category.id} onClick={() => {
                                router.push(`/my-works/${router.query?.id}/preview/${category.id}`)
                            }}>
                                {category.version_name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Container maxWidth="lg">
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <AppImageUpload onChange={(file) => { formik.setFieldValue('form_file', file) }} />
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
                    </Container>

                    <Container sx={{ marginTop: "2em" }} >
                        {formik.values.rich_text === "" ? <></> : <ReactQuill modules={{
                            toolbar: toolbarOptions,
                        }} value={JSON.parse(formik.values.rich_text === '' ? '{}' : formik.values.rich_text)} placeholder='Viết gì đó' onChange={onEditorChange} theme='snow' />}
                    </Container>



                </Grid>

            </Stack>
        </>
    );
};

export default NewChapterPage;