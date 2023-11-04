
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import { MenuItem, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CloudUpload } from '@mui/icons-material';
import ChapterVersionService from '@/services/chapter-version';
import { useRouter } from 'next/router';
import ChapterService from '@/services/chapter';
import StoryService from '@/services/story';
import axios from 'axios';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];
const NewChapterPage = () => {
    const router = useRouter();

    const storyId = router.query.id;
    const [chapterId, setChapterId] = useState(router.query['chapter-id']);
    const [chapters, setChapters] = useState([]);
    const [chapterVersions, setChapterVersions] = useState([]);
    const [currentChapterVersion, setCurrentChapterVersion] = useState({});
    const [value, setValue] = useState('');

    useEffect(() => {
        // get all chapters of a story
        StoryService.getById(storyId).then(res => {

        })

        // get to set current chapterverion id
        const fetchCurrentChapterVersion = async () => {
            return await ChapterService.getById(chapterId)
        }

        const fetchChapterVersions = async () => {
            return await ChapterVersionService.getAll(chapterId)
        }

        const fetchAll = async () => {
            const tempLoadCurrentChapterVersion = await fetchCurrentChapterVersion();
            const tempLoadCChapterVersions = await fetchChapterVersions();

            setCurrentChapterVersion(tempLoadCurrentChapterVersion.current_chapter_version ?? {});
            setChapterVersions(tempLoadCChapterVersions);

        }

        fetchAll();

    }, [])

    const editor = React.createRef;
    const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
    const formikForHistory = useFormik({
        initialValues: {
            chapter_version: ''
        }
    })
    const formik = useFormik({
        initialValues: {
            chapter_id: chapterId,
            content: '',
            rich_text: '',
            title: '',
            version_name: Date.now().toLocaleString(),
            form_file: null,
            isSubmit: null
        },
        validationSchema: Yup.object({
            content: Yup.string().trim().min(1).required('Bắt buộc nhập nội dung')
        }),
        onSubmit: async (values, helpers) => {
            try {
                console.log(values);
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
        console.log('content ', content)
        setValue(content);
        formik.setFieldValue('content', editor.getText());
        formik.setFieldValue('rich_text', JSON.stringify(editor.getContents().ops));
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
        ChapterService.publish(chapterId).then(res => {

        })
    }

    const onSaveDraftChapter = async () => {
        // create chapter version
        const values = formik.values;
        const formData = new FormData();
        Object.keys(values).forEach(key => formData.append(key, values[key]));
        console.log('body', formData)
        try {
            const response = await ChapterVersionService.create(formData);
            console.log('response ', response)
        } catch (error) {
            console.log(error)
        }

    }

    const onPreviewChapter = () => {
        //save draft before view
        onSaveDraftChapter();

    }
    return (

        <>
            <Grid
                container
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
                alignContent="center"


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
                    <form noValidate onSubmit={formikForHistory.handleSubmit}>

                        <TextField
                            variant="outlined"
                            select
                            defaultValue={currentChapterVersion.id}
                            placeholder='Chọn chapter'
                            helperText={formik.touched.category && formik.errors.category}
                            name="category"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            size="small"
                            value={formik.values.category}
                        >
                            {chapterVersions.map((category) => (
                                <MenuItem key={category.id} value={category.id} onClick={() => { router.push(`/my-works/${storyId}/preview/${category.id}`) }}>
                                    {category.version_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </form>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                            Tải ảnh bìa
                            <TextField onChange={(e) => {
                                e.preventDefault();
                                formik.setFieldValue('form_file', e.currentTarget.files[0])
                            }} inputProps={{ accept: '.jpg,.jpeg,.png' }} hidden type="file" />
                        </Button>
                        <TextField
                            variant="standard"
                            placeholder='Đặt tên cho chương position'
                            inputProps={{ min: 1, style: { textAlign: 'center', margin: '1em', fontSize: '1.2em' } }}
                            error={!!(formik.touched.title && formik.errors.title)}
                            fullWidth
                            name="title"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            size="large"
                            value={formik.values.title}
                        />
                        <ReactQuill modules={{
                            toolbar: toolbarOptions,
                        }} ref={editor} value={value} placeholder='Viết gì đó' onChange={onEditorChange} theme='snow' />
                        {typeof value}
                        {value}
                        <ReactQuill
                            readOnly theme='bubble' value={value} />
                    </form>
                </Stack>

            </Stack>
        </>
    );
};

export default NewChapterPage;