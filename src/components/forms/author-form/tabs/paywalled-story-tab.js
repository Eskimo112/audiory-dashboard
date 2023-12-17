import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import {
  CheckBoxOutlined,
  CheckCircle,
  CheckCircleOutline,
  DeleteOutline,
  HelpOutline,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { FieldArray, useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import ConfirmDialog from '@/components/dialog/reuse-confirm-dialog';
import { PaywalledContract } from '@/constants/paywalled_contract';
import {
  CONTRACT_TERMS,
  StoryAssesCriteria,
} from '@/constants/story_assess_criteria';
import { useRequestHeader } from '@/hooks/use-request-header';
import StoryService from '@/services/story';
import { toastError, toastSuccess } from '@/utils/notification';

const PaywalledStoryTab = ({ story, handleRefetch }) => {
  const requestHeader = useRequestHeader();

  const [tagList, setTagList] = useState(story?.tags?.map((a) => a.name) ?? []);

  const [allCheckedCriteria, setAllCheckedCriteria] = useState(true);
  const [count, setCount] = useState(0);

  const { data: criteriaData = [], isLoading: isLoadingCriteria } = useQuery(
    ['criteriaData', story.isPaywalled === false],
    async () =>
      await new StoryService(requestHeader).getPaywalledCriteria(story?.id),
  );

  useEffect(() => {
    if (criteriaData !== undefined) {
      console.log(criteriaData.message);
      for (let index = 0; index < criteriaData.message?.length; index++) {
        const element = criteriaData.message[index];
        console.log(element.is_passed);

        if (!element.is_passed) {
          setAllCheckedCriteria(false);
        }
      }
    }
  }, [criteriaData]);

  const [isOpen, setIsOpen] = React.useState(false);
  const handleDialogOpen = () => {
    setIsOpen(true);
  };
  const handleDialogClose = (isConfirm) => {
    setIsOpen(false);
    if (isConfirm) {
      if (allCheckedCriteria) {
        setIsContractOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      formik.setFieldValue('isPaywalled', false);
    }
  };

  const [isContractOpen, setIsContractOpen] = React.useState(false);
  const handleDialogContractOpen = () => {
    setIsContractOpen(true);
  };
  const handleDialogContractClose = async (isConfirm) => {
    console.log(isConfirm);
    setIsContractOpen(false);

    if (isConfirm) {
      setIsPriceModalOpen(true);
    }
  };

  const [isPriceModalOpen, setIsPriceModalOpen] = React.useState(false);
  const handleDialogPriceModalOpen = () => {
    setIsPriceModalOpen(true);
  };
  const handleDialogPriceModalClose = async (isConfirm) => {
    setIsPriceModalOpen(false);
    // handle paywall a story
    if (isConfirm) {
      try {
        await new StoryService(requestHeader)
          .paywall({ storyId: story?.id, price: formik.values.chapter_price })
          .then((res) => {
            if (res.code === 200) {
              toastSuccess('Bật thu phí thành công');
            } else {
              toastError('Bật thu phí không thành công');
            }
          });
      } catch (error) {}
    }
  };

  const handlePaywalled = async () => {
    try {
      await new StoryService(requestHeader)
        .paywall({ storyId: story?.id, price: formik.values.chapter_price })
        .then((res) => {
          if (res.code === 200) {
            toastSuccess('Bật thu phí thành công');
          } else {
            toastError('Bật thu phí không thành công');
          }
        });
    } catch (error) {}
  };
  const formik = useFormik({
    initialValues: {
      isPaywalled: story.is_paywalled ?? false,
      chapter_price: story?.chapter_price ?? 1,
      formFile: story.cover_url ?? null,
      submit: null,
    },
    // enableReinitialize: true,
    validationSchema: Yup.object({
      chapter_price: Yup.number()
        .min(1, 'Ít nhất 1 xu')
        .max(10, 'Nhiều nhất 10 xu')
        .required(),
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

  const ContractTermComponent = ({ index, title, contents }) => {
    return (
      <Grid sx={{ marginBottom: 1 }} container spacing={0}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: '600' }}
          color="initial">
          {title}
        </Typography>
        {contents.length === 1 ? (
          <Typography align="justify" variant="body2" color="inherit">
            {contents}
          </Typography>
        ) : (
          <Grid container spacing={0}>
            {contents.map((content, idx) => (
              <Typography
                align="justify"
                key={idx}
                variant="body2"
                color="inherit">
                {idx === 4 ? '' : `${idx + 1}.`} {content}
              </Typography>
            ))}
          </Grid>
        )}
      </Grid>
    );
  };

  const CheckedCirCle = ({ isChecked = true }) => {
    return isChecked ? (
      <CheckCircleOutline color="primary" />
    ) : (
      <RadioButtonUnchecked color="secondary" />
    );
  };

  return (
    <>
      <Grid
        container
        width={1}
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {story?.is_paywalled ? (
          <Grid
            container
            fullWidth
            direction="column"
            sx={{ padding: 0, width: '40vw', height: 400 }}>
            <Stack container spacing={0}>
              <Typography variant="h6" color="initial">
                Truyện đã thương mại hóa
              </Typography>
            </Stack>

            <form noValidate>
              <Grid sx={{ width: '100%' }} container direction="column">
                <TextField
                  variant="outlined"
                  fullWidth
                  name="chapter_price"
                  type="number"
                  size="small"
                  value={formik.values.chapter_price}
                  min="1"
                  max="10"
                  onInput={(e) => {
                    if (e.target.value < 1) e.target.value = 1;
                    if (e.target.value > 10) e.target.value = 10;
                  }}
                  error={
                    !!(
                      formik.touched.chapter_price &&
                      formik.errors.chapter_price
                    )
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Typography variant="body2" color="ink.light">
                  Khoảng giá 1-10 xu
                </Typography>
                <Typography variant="body2" color="ink.light">
                  * Giá của chương có thể thay đổi sau đó
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handlePaywalled}>
                  Đổi giá chương
                </Button>
                <Grid sx={{ marginTop: 2 }} container spacing={0}>
                  {CONTRACT_TERMS.slice(1, 3).map((term, index) => (
                    <ContractTermComponent
                      key={index}
                      index={index + 1}
                      title={` ${term.title}`}
                      contents={term.contents}
                    />
                  ))}
                </Grid>
              </Grid>
            </form>
          </Grid>
        ) : (
          <>
            <StoryAssesCriteria />
            <Button
              fullWidth
              variant="contained"
              color="info"
              onClick={handleDialogOpen}>
              Xem điều kiện thương mại hóa
            </Button>
            <ConfirmDialog
              width="50%"
              title={`Đánh giá điều kiện dành cho truyện trả phí`}
              actionBgColor={allCheckedCriteria ? 'primary' : 'secondary'}
              isReverse={true}
              content={
                isLoadingCriteria ? (
                  <Skeleton />
                ) : (
                  <Grid container spacing={0}>
                    <Grid container spacing={0}>
                      <Typography
                        variant="subtitle1"
                        color={allCheckedCriteria ? 'primary' : 'secondary'}>
                        {allCheckedCriteria
                          ? `Xin chúc mừng, tác phẩm ${story?.title} đạt đủ điền kiện thương mại hóa`
                          : `Xin lỗi, tác phẩm ${story?.title} hiện chưa đáp ứng đủ điều kiện thương mại hóa`}
                      </Typography>
                    </Grid>
                    {criteriaData.message?.map((criteria, index) => (
                      <Grid
                        key={index}
                        container
                        direction="column"
                        sx={{ padding: '0.5em 2em' }}>
                        <Grid container spacing={0}>
                          <Grid xs={1}>
                            <CheckedCirCle isChecked={criteria?.is_passed} />{' '}
                          </Grid>
                          <Grid xs={11}>{criteria?.description}</Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )
              }
              isOpen={isOpen}
              handleClose={handleDialogClose}
              actionContent={allCheckedCriteria ? 'Tiếp tục' : 'Tôi đã hiểu'}
              cancelContent="Hủy thao tác"
            />

            <ConfirmDialog
              width={1000}
              title={``}
              actionBgColor="primary"
              isReverse={true}
              content={
                isLoadingCriteria ? (
                  <Skeleton />
                ) : (
                  <Grid
                    container
                    direction="column"
                    sx={{ padding: '1em 1.2em' }}>
                    <PaywalledContract />
                  </Grid>
                )
              }
              isOpen={isContractOpen}
              handleClose={handleDialogContractClose}
              actionContent="Tôi đồng ý, đi tiếp"
              cancelContent="Tôi không đồng ý"
            />

            <ConfirmDialog
              width={'30%'}
              title={`Nhập giá cho truyện của bạn`}
              actionBgColor="primary"
              isReverse={true}
              content={
                <>
                  <form noValidate>
                    <Grid container direction="column">
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="chapter_price"
                        type="number"
                        size="small"
                        value={formik.values.chapter_price}
                        min="1"
                        max="10"
                        onInput={(e) => {
                          if (e.target.value < 1) e.target.value = 1;
                          if (e.target.value > 10) e.target.value = 10;
                        }}
                        error={
                          !!(
                            formik.touched.chapter_price &&
                            formik.errors.chapter_price
                          )
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <Typography variant="body2" color="ink.light">
                        Khoảng giá 1-10 xu
                      </Typography>
                      <Typography variant="body2" color="ink.light">
                        * Giá của chương có thể thay đổi sau đó
                      </Typography>
                    </Grid>
                  </form>
                </>
              }
              isOpen={isPriceModalOpen}
              handleClose={handleDialogPriceModalClose}
              actionContent="Bật trả phí"
              cancelContent="Hủy thao tác"
            />
          </>
        )}
      </Grid>
    </>
  );
};
export default PaywalledStoryTab;
