
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import { Card, CircularProgress, MenuItem, Stack, TextField } from '@mui/material';
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
const NewChapterPage = () => {

    const router = useRouter();
    const storyId = router.query.id;
    const chapterId = router.query['chapter-id'];

    const auth = useAuth();
    const jwt = auth.user.token;

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
    console.log(chapterData)

    const editor = React.createRef;
    const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

    const formik = useFormik({
        initialValues: {
            chapter_id: chapterId,
            content: chapterData?.current_chapter_version?.content ?? '',
            rich_text: chapterData?.current_chapter_version?.rich_text ?? '{}',
            title: chapterData?.current_chapter_version?.title ?? '',
            version_name: '',
            form_file: '',
            isSubmit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            content: Yup.string().trim().min(1).required('Bắt buộc nhập nội dung')
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
        console.log(formik.values.rich_text);
        setValue(content);
        // formik.setFieldValue('content', editor.getText());
        // formik.setFieldValue('rich_text', JSON.stringify(editor.getContents().ops));
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
        if (formik.values.content.replace('\n') === '') {
            toastError('Nội dung quá ngắn');

        } else {
            try {

                ChapterService.publish(chapterId).then(res => {
                })
                toastSuccess('Đăng tải thành công')
            } catch (error) {
                toastError('Đăng tải không thành công')
            }
        }


    }

    const onSaveDraftChapter = async () => {
        // create chapter version
        const values = formik.values;
        const formData = new FormData();
        Object.keys(values).forEach(key => formData.append(key, values[key]));
        console.log('body', formData)
        try {
            const response = await ChapterVersionService.create({ body: formData, jwt });
            toastSuccess('Lưu thành công');
            refetch();

        } catch (error) {
            console.log(error)
        }

    }

    const onPreviewChapter = () => {
        // save draft before view
        onSaveDraftChapter();
        router.push(`/my-works/${router.query?.id}/preview/${chapterVersionsData[0].id}`)

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
                xs={{ paddingTop: "2em" }}
            >
                <Button variant="contained" color="primary" onClick={onPublishChapter}>
                    Đăng tải
                </Button>
                <Button variant="outlined" color="inherit" onClick={onSaveDraftChapter}>
                    Lưu bản thảo
                </Button>
                <Button variant="contained" color="inherit" onClick={onPreviewChapter} >
                    Xem trước
                </Button>
            </Grid>

            <Stack direction="column" justifyContent="center" alignItems="center">
                <Stack width={1 / 2}>

                    <TextField
                        variant="outlined"
                        select
                        placeholder='Chọn chapter'
                        onBlur={formik.handleBlur}
                        onChange={formik.values.title}
                        type="text"
                        size="small"
                        value={currentChapterVersion?.id}

                    >
                        {chapterVersionsData && chapterVersionsData.map((category) => (
                            <MenuItem key={category.id} value={category.id} onClick={() => { router.push(`/my-works/${storyId}/preview/${category.id}`) }}>
                                {category.version_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <form noValidate onSubmit={formik.handleSubmit}>
                        <AppImageUpload onChange={(file) => { formik.setFieldValue('form_file', file) }} />
                        <TextField
                            variant="standard"
                            placeholder='Đặt tên cho chương'
                            inputProps={{ min: 1, style: { textAlign: 'center', margin: '1em', fontSize: '1.2em' } }}
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
                    <ReactQuill modules={{
                        toolbar: toolbarOptions,
                    }} value={JSON.parse(formik.values.rich_text)} placeholder='Viết gì đó' onChange={onEditorChange} theme='snow' />


                    {/* <ReactQuill
                        readOnly theme='bubble' value={{ ops: formik.values.rich_text }} /> */}
                </Stack>

            </Stack>
        </>
    );
};

export default NewChapterPage;