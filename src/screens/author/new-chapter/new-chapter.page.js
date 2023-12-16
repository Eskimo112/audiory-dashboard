// eslint-disable-next-line simple-import-sort/imports
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import 'react-quill/dist/quill.snow.css';

import {
  Box,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  MenuItem,
  Popover,
  Skeleton,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ChapterVersionService from '@/services/chapter-version';
import { useRouter } from 'next/router';
import ChapterService from '@/services/chapter';
import { useQuery } from 'react-query';
import { toastError, toastSuccess } from '@/utils/notification';
import { AppImageUpload } from '@/components/app-image-upload';
import AuthorBreadCrumbs from '@/components/author-bread-crumbs';
import {
  CheckCircle,
  PublishRounded,
  SaveRounded,
  Visibility,
  VisibilityOffRounded,
  VisibilityOutlined,
} from '@mui/icons-material';
import { formatDateTime } from '@/utils/formatters';
import { useRequestHeader } from '@/hooks/use-request-header';
import {
  MAX_CONTENT_SIZE,
  byteSizeFromString,
  convertImageLinkToBase64,
  fileSizeFromBase64,
} from '@/utils/filesize-counter';
import dayjs from 'dayjs';
import ReportService from '../../../services/report';
import { useAuth } from '../../../hooks/use-auth';
import StoryService from '../../../services/story';
import ModerationModal from './moderation-modal';
import dynamic from 'next/dynamic';
import useNextNavigateAway from '../../../hooks/use-navigate-away';
import { useConfirmDialog } from '../../../hooks/use-confirm-dialog';

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default),
  {
    ssr: false,
  },
);

const toolbarOptions = [
  ['bold', 'italic', 'underline'], // toggled buttons

  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  // [{ 'direction': 'rtl' }],                         // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['image'], // add's image support

  [{ align: [] }],
];
const MIN_WORDS = 5;
const NewChapterPage = () => {
  const router = useRouter();
  const requestHeader = useRequestHeader();

  const storyId = router.query.id;
  const chapterId = router.query['chapter-id'];

  const {
    data: chapterData = {},
    isLoading,
    refetch,
    isRefetching,
  } = useQuery(
    ['chapter', chapterId],
    async () => await new ChapterService(requestHeader).getById(chapterId),
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  const {
    data: chapterVersionsData = [],
    isLoading: listLoading,
    refetch: refetch2,
  } = useQuery(
    ['chapterVersionList', chapterId],
    async () =>
      await new ChapterVersionService(requestHeader).getAll({ chapterId }),
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  const {
    user: { id: userId },
  } = useAuth();

  const [value, setValue] = useState('');
  const [contentSize, setContentSize] = useState(0);
  const [imageArr, setImageArr] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [moderationModal, setModerationModal] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [reportFormFile, setReportFormFile] = useState();

  const [blockedVersionId, setBlockedVersionId] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event, storyData) => {
    setStoryData(storyData);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [storyData, setStoryData] = useState({});

  const formik = useFormik({
    initialValues: {
      chapter_id: chapterId,
      images: {},
      content: chapterData?.current_chapter_version?.content ?? '',
      rich_text:
        chapterData?.current_chapter_version?.rich_text === '' ||
        chapterData?.current_chapter_version?.rich_text === undefined
          ? '{}'
          : chapterData?.current_chapter_version?.rich_text,
      title: chapterData?.current_chapter_version?.title ?? '',
      version_name: '',
      form_file: '',
      isSubmit: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .min(1, 'Tiêu đề ít nhất 1 ký tự')
        .max(255)
        .required('Bắt buộc nhập tiêu đề'),
    }),
    onSubmit: async (values, helpers) => {
      // try {
      // } catch (error) {
      //   helpers.setStatus({ success: false });
      //   helpers.setErrors({ submit: error.message });
      //   helpers.setSubmitting(false);
      // }
    },
  });

  const onEditorChange = (content, delta, source, editor) => {
    // content

    var imagesArr = editor
      .getContents()
      .ops?.filter((ele) => ele.insert.image !== undefined)
      ?.map((image) => image?.insert?.image);
    console.log(imageArr);
    setImageArr(imagesArr);

    setValue(editor.getText().trim());
    formik.setFieldValue('rich_text', JSON.stringify(editor.getContents()));

    const base64Result = [];
    imagesArr.forEach((image) => {
      base64Result.push(convertImageLinkToBase64(image));
    });

    formik.setFieldValue('images', base64Result);
    formik.setFieldValue('content', editor.getText());
  };

  const handleCreateChapter = async () => {
    const body = {
      position: storyData.chapters.length + 1,
      story_id: storyId,
    };

    try {
      await new ChapterService(requestHeader).create(body).then((res) => {
        router.push(`/my-works/${storyData?.id}/write/${res?.id}`);
        toastSuccess('Tạo chương mới thành công');
      });
      refetch();
    } catch (error) {
      console.log(error);
      toastError('Tạo chương không thành công');
    }
  };

  const renderCustomToolbar = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const reportFormik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Vui lòng nhập tiêu đề'),
      description: Yup.string().required('Vui lòng nhập nội dung'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await new ReportService(requestHeader).createReport({
          title: values.title,
          description: values.description,
          user_id: userId,
          reported_id: currentChapterVersion.id,
          report_type: 'CONTENT_VIOLATION_COMPLAINT',
          form_file: reportFormFile,
        });
        setOpenReport(false);

        toastSuccess('Tạo báo cáo thành công');
      } catch (e) {
        toastError(e.toString());
      }
      formik.handleReset();
    },
  });

  const isChanged = useMemo(() => {
    if (!formik.values) return false;
    if (formik.values.form_file) return true;
    if (!chapterData.current_chapter_version) return true;
    if (
      formik.values.rich_text !== chapterData.current_chapter_version.rich_text
    )
      return true;
    if (formik.values.title !== chapterData.current_chapter_version.title)
      return true;
    return false;
  }, [chapterData, formik]);

  const handleTurnOnMature = async () => {
    try {
      const body = new FormData();
      body.append('is_mature', true);

      await new StoryService(requestHeader)
        .edit({ body, storyId: chapterData?.story_id })
        .then((res) => {
          if (res.code === 200) {
            toastSuccess('Đã bật nội dung trưởng thành cho truyện');
            refetch();
            refetch2();
          } else {
            toastError(res.statusText);
          }
        });
    } catch (error) {
      console.log('error', error);
    }
    setOpenDialog(false);
  };

  const onSaveDraftChapter = useCallback(
    async (isPreview, isPublish) => {
      if (value.split(' ').length < MIN_WORDS) {
        toastError(`Quá ngắn để lưu bản thảo`);
      } else {
        // content size (text+image) handler
        // calculate link images and file images size
        let imagesInBytes = 0;
        imageArr.forEach((image) => {
          if (image.includes('http')) {
            convertImageLinkToBase64(image, function (base64String) {
              imagesInBytes += fileSizeFromBase64({ base64String });
            });
          } else {
            imagesInBytes += fileSizeFromBase64({ base64String: image });
          }
        });
        setContentSize(byteSizeFromString(value) + imagesInBytes);

        const values = formik.values;
        const formData = new FormData();
        Object.keys(values).forEach((key) => formData.append(key, values[key]));

        if (chapterData.current_chapter_version)
          formData.append(
            'banner_url',
            chapterData.current_chapter_version.banner_url,
          );

        if (contentSize > MAX_CONTENT_SIZE) {
          toastError('Nội dung chương vượt quá 2MB');
          return;
        }

        setIsSubmitting(true);
        if (!isChanged) {
          if (isPreview) {
            router.push(
              `/my-works/${router.query?.id}/preview/${chapterData?.current_chapter_version.id}?is_preview=true`,
            );
          }
          if (isPublish) {
            await new ChapterService(requestHeader)
              .publish(chapterId)
              .then((res) => {
                if (res.code === 200) {
                  router.push(`/my-works/${router.query?.id}`);
                  toastSuccess('Đăng tải thành công');
                } else {
                  toastError(res.message);
                }
              })
              .catch((e) => {
                if (
                  e.response.data.message ===
                  'Hãy gắn nhãn trưởng thành để đi tiếp'
                ) {
                  setBlockedVersionId(
                    e.response.data.data.current_chapter_version.id,
                  );
                  setOpenDialog(true);
                } else {
                  toastError('Không thể đăng tải chương');
                }
              });
          }
          if (!isPreview && !isPublish) {
            await new ChapterVersionService(requestHeader)
              .create({ body: formData })
              .then((res) => {
                toastSuccess('Lưu bản thảo thành công');
                refetch();
                refetch2();
              });
          }
          formik.setFieldValue('form_file', undefined);
          setIsSubmitting(false);
          return;
        }

        await new ChapterVersionService(requestHeader)
          .create({ body: formData })
          .then((res) => {
            if (res.code === 200) {
              if (isPreview) {
                router.push(
                  `/my-works/${router.query?.id}/preview/${res.data?.id}?is_preview=true`,
                );
              }
              if (isPublish) {
                new ChapterService(requestHeader)
                  .publish(chapterId)
                  .then((res) => {
                    if (res.code === 200) {
                      router.push(`/my-works/${router.query?.id}`);
                      toastSuccess('Đăng tải thành công');
                    } else {
                      toastError(res.message);
                    }
                  })
                  .catch((e) => {
                    if (
                      e.response.data.message ===
                      'Hãy gắn nhãn trưởng thành để đi tiếp'
                    ) {
                      setBlockedVersionId(
                        e.response.data.data.current_chapter_version.id,
                      );
                      setOpenDialog(true);
                    } else {
                      toastError('Không thể đăng tải chương');
                    }
                  });
              } else {
                toastSuccess('Lưu bản thảo thành công');
                refetch();
                refetch2();
              }
            } else {
              toastError(res.message);
            }
          })
          .finally(() => {
            formik.setFieldValue('form_file', undefined);
            setIsSubmitting(false);
          });
      }
    },
    [
      chapterData.current_chapter_version,
      chapterId,
      contentSize,
      formik,
      imageArr,
      isChanged,
      refetch,
      refetch2,
      requestHeader,
      router,
      value,
    ],
  );
  const [userConfirmToLeave, setUserConfirmToLeave] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChanged) return;
      if (value.split(' ').length < MIN_WORDS) return;
      onSaveDraftChapter(false, false);
    }, 5000);
    return () => clearInterval(interval);
  }, [isChanged, onSaveDraftChapter, value]);

  const {
    confirmCbRef: continueRouterPushRef,
    show: warningDialog,
    setShow: setWarningDialog,
  } = useConfirmDialog();

  // useNextNavigateAway(isChanged, (routerPush) => {
  //   continueRouterPushRef.current = async () => {
  //     await routerPush();
  //   };
  //   if (!userConfirmToLeave) {
  //     setWarningDialog(true);
  //   }
  //   return userConfirmToLeave;
  // });

  const currentChapterVersion = chapterData
    ? chapterData.current_chapter_version
    : null;

  if (isLoading || listLoading)
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
          {listLoading ? (
            <Skeleton />
          ) : (
            <AuthorBreadCrumbs
              storyGenerator={true}
              chapterTitle={` ${chapterData?.title ?? 'Tiêu đề chương'}`}
              handleOpen={handleClick}
            />
          )}

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onBlur={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            sx={{ maxHeight: '25em' }}>
            <Grid container direction="column">
              {storyData &&
                storyData?.chapters?.map((chapter, index) => (
                  <Button
                    key={chapter?.id}
                    variant="text"
                    spacing={0}
                    sx={{
                      minWidth: '30em',
                      maxWidth: '25em',
                      display: 'flex',
                      direction: 'row',
                      border: 'none',
                      borderBottom: '0.5px solid #F1EFEF',
                      padding: '0.6em 1.2em',
                      borderRadius: '0px',
                    }}
                    onClick={(e) => {
                      router.push(
                        `/my-works/${storyData?.id}/write/${chapter?.id}`,
                      );
                    }}>
                    <Grid item xs={10} container spacing={0}>
                      <Grid
                        container
                        spacing={0}
                        direction="row"
                        justifyContent="flex-start">
                        <Typography
                          sx={{ fontWeight: 'bold' }}
                          variant="subtitle1"
                          color="ink.main">
                          Chương {index + 1} -
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 'bold',
                            textAlign: 'start',
                            width: '12em',
                            textOverflow: 'ellipsis',
                          }}
                          variant="subtitle1"
                          color="ink.main">
                          {chapter?.title ?? ' Tiêu đề'}
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        spacing={0}
                        direction="row"
                        columnGap="0.2em">
                        <Typography
                          color={chapter?.is_draft ? 'ink.lighter' : 'primary'}
                          variant="body1">
                          ({chapter?.is_draft ? 'Bản thảo' : 'Đã đăng tải'}){' '}
                        </Typography>
                        <Typography variant="body1" color="sky.dark">{`${
                          formatDateTime(
                            chapter?.updated_date ?? chapter?.created_date,
                          ).split(' ')[0]
                        }`}</Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      container
                      justifyContent="end"
                      alignItems="center">
                      {chapterData && chapterData?.id === chapter.id ? (
                        <CheckCircle color="primary" fontSize="medium" />
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Button>
                ))}
              <Grid item xs={12} container spacing={0}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ margin: '1em 2em' }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateChapter();
                  }}>
                  Thêm chương mới
                </Button>
              </Grid>
            </Grid>
          </Popover>
        </Grid>
      </Stack>
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Grid width={1 / 2}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ margin: '1em 0' }}>
            <Stack>
              {chapterVersionsData?.length !== 0 ? (
                <>
                  <TextField
                    variant="outlined"
                    select
                    placeholder="Chọn chapter"
                    onBlur={formik.handleBlur}
                    type="text"
                    size="small"
                    value={currentChapterVersion?.id ?? ''}>
                    {chapterVersionsData &&
                      chapterVersionsData
                        ?.sort((a, b) =>
                          dayjs(b?.timestamp).diff(dayjs(a?.timestamp)),
                        )
                        .map((version, index) => (
                          <MenuItem
                            key={index}
                            value={version.id}
                            onClick={() => {
                              router.push(
                                `/my-works/${router.query?.id}/preview/${version.id}`,
                              );
                            }}>
                            {version.version_name}
                          </MenuItem>
                        ))}
                  </TextField>
                </>
              ) : (
                <></>
              )}
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              alignContent="flex-end"
              gap="8px">
              <Button
                disabled={!formik.isValid || !isChanged || isSubmitting}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  onSaveDraftChapter(false, false);
                }}
                startIcon={
                  <SvgIcon>
                    <SaveRounded></SaveRounded>
                  </SvgIcon>
                }>
                Lưu bản thảo
              </Button>
              <Button
                disabled={!formik.isValid || isSubmitting}
                variant="outlined"
                color="primary"
                startIcon={
                  <SvgIcon>
                    <VisibilityOutlined></VisibilityOutlined>
                  </SvgIcon>
                }
                onClick={() => {
                  onSaveDraftChapter(true, false);
                }}>
                Xem trước
              </Button>
              <Button
                disabled={
                  (!chapterData.is_draft && !formik.isValid) || isSubmitting
                }
                variant="contained"
                color="primary"
                startIcon={
                  <SvgIcon>
                    <PublishRounded></PublishRounded>
                  </SvgIcon>
                }
                onClick={() => {
                  onSaveDraftChapter(false, true);
                }}>
                {'Đăng tải'}
              </Button>
            </Stack>
          </Grid>

          <Grid maxWidth="lg">
            <form noValidate onSubmit={formik.handleSubmit}>
              {isLoading ? (
                <Skeleton height="250px" />
              ) : (
                <Box height="250px">
                  <AppImageUpload
                    defaultUrl={currentChapterVersion?.banner_url}
                    onChange={(file) => {
                      formik.setFieldValue('form_file', file);
                    }}
                  />
                </Box>
              )}
              <TextField
                variant="standard"
                placeholder="Đặt tên cho chương"
                inputProps={{
                  min: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.2em',
                    marginTop: '1em',
                  },
                }}
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

          <Container
            sx={{
              marginTop: '2em',
              '.ql-container': {
                fontSize: '18px',
              },
            }}>
            {formik.values.rich_text === '' ? (
              <></>
            ) : (
              <ReactQuill
                modules={{
                  toolbar: toolbarOptions,
                }}
                value={JSON.parse(
                  formik.values.rich_text === ''
                    ? '{}'
                    : formik.values.rich_text,
                )}
                placeholder="Viết gì đó"
                onChange={onEditorChange}
                theme="snow"
              />
            )}
          </Container>
        </Grid>
      </Stack>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        PaperProps={{
          sx: {
            p: 1,
            width: '400px',
          },
        }}>
        <DialogTitle>Bạn phải bật nội dung trưởng thành để đi tiếp</DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(false);
              setOpenReport(true);
            }}>
            Kháng cáo
          </Button>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setModerationModal(true);
            }}>
            Xem chi tiết
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTurnOnMature()}
            autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {moderationModal && blockedVersionId && (
        <ModerationModal
          chapterVersionId={blockedVersionId}
          handleClose={() => setModerationModal(false)}
        />
      )}
      {/* REPORT DIALOG */}
      <Dialog
        open={openReport}
        onClose={(e) => {
          e.stopPropagation();
          setOpenReport(false);
        }}
        PaperProps={{
          sx: {
            p: 1,
            width: '400px',
          },
        }}>
        <DialogTitle>Tạo một báo cáo</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <Stack gap={1} alignItems="center">
            <Box height={250} width="70%" p="8px">
              <AppImageUpload
                id={'report-file'}
                onChange={(file) => setReportFormFile(file)}
              />
            </Box>
          </Stack>

          <Stack>
            <FormLabel>Tiêu đề</FormLabel>
            <TextField
              error={
                !!(reportFormik.touched.title && reportFormik.errors.title)
              }
              fullWidth
              helperText={
                reportFormik.touched.title && reportFormik.errors.title
              }
              variant="outlined"
              name="title"
              onBlur={reportFormik.handleBlur}
              onChange={reportFormik.handleChange}
              value={reportFormik.values.title}
              type="text"
            />
          </Stack>
          <Stack>
            <FormLabel>Nội dung</FormLabel>
            <TextField
              fullWidth
              error={
                !!(
                  reportFormik.touched.description &&
                  reportFormik.errors.description
                )
              }
              helperText={
                reportFormik.touched.description &&
                reportFormik.errors.description
              }
              multiline
              rows={5}
              variant="outlined"
              name="description"
              onBlur={reportFormik.handleBlur}
              onChange={reportFormik.handleChange}
              type="text"
              value={reportFormik.values.description}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setOpenReport(false);
            }}>
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              reportFormik.handleSubmit();
            }}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* conirm dialog */}
      <Dialog
        open={warningDialog}
        onClose={() => {
          setUserConfirmToLeave(false);
          setWarningDialog(false);
        }}
        PaperProps={{
          sx: {
            p: 1,
            width: '400px',
          },
        }}>
        <DialogTitle>Rời đi mà không lưu?</DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={(e) => {
              setUserConfirmToLeave(false);
              setWarningDialog(false);
            }}>
            Hủy bỏ
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setUserConfirmToLeave(true);
              setWarningDialog(false);
              continueRouterPushRef.current?.();
            }}
            autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewChapterPage;
