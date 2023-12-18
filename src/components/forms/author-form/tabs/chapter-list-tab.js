import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  AddRounded,
  CleaningServices,
  DeleteForeverOutlined,
  MoreVert,
  UnpublishedOutlined,
} from '@mui/icons-material';
import {
  Button,
  Grid,
  IconButton,
  Pagination,
  Popover,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';

import ConfirmDialog from '@/components/dialog/reuse-confirm-dialog';
import { useRequestHeader } from '@/hooks/use-request-header';
import ChapterService from '@/services/chapter';
import { formatDate, timeAgo } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

const ChapterCard = ({ chapter, index, storyId, length, refetch }) => {
  const router = useRouter();
  const requestHeader = useRequestHeader();
  const handleNavigate = () => {
    router.push(`/my-works/${storyId}/write/${chapter.id}`);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [isOpen, setIsOpen] = React.useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = React.useState(false);
  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  const handleDialogClose = (isConfirm) => {
    setIsOpen(false);
    if (isConfirm === true) {
      onDeleteChapter({ chapterId: chapter.id });
    }
  };

  const handlePaywallDialogOpen = () => {
    setIsPaywallOpen(true);
  };
  const handlePaywallDialogClose = () => {
    setIsPaywallOpen(false);
  };

  const isDraft = chapter.is_draft;
  const isLast = length === 1;
  // chapter handler
  const onPublishChapter = async ({ chapterId, isPublish = true }) => {
    if (isPublish) {
      try {
        await new ChapterService(requestHeader)
          .publish(chapterId)
          .then((res) => {
            if (res.code === 200) {
              toastSuccess('Đăng tải thành công');
              refetch();
            } else if (res.code === 500) {
              toastError('Không thể đăng tải chương trống');
            }
          });
      } catch (error) {
        toastError('Không thể đăng tải chương trống');
      }
    } else {
      try {
        await new ChapterService(requestHeader)
          .unpublish(chapterId)
          .then((res) => {
            if (res.code === 200) {
              toastSuccess('Gỡ đăng tải thành công');
              refetch();
            } else {
              toastError(res.message);
            }
          });
      } catch (error) {
        console.log(error);
        toastError('Gỡ đăng tải không thành công');
      }
    }
  };
  const onDeleteChapter = async ({ chapterId, isLast = false }) => {
    await new ChapterService(requestHeader).delete(chapterId).then((res) => {
      if (res.code === 200) {
        toastSuccess('Xóa thành công');
        refetch();
      } else {
        toastError(res.message);
      }
    });
    if (isLast) {
      await new ChapterService(requestHeader).delete(chapterId).then((res) => {
        if (res.code === 200) {
          toastSuccess('Xóa thành công');
          refetch();
        } else {
          toastError(res.message);
        }
      });
    }
  };

  return (
    <Stack
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNavigate();
      }}
      sx={{
        width: '100%',
        padding: '12px 16px',
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: !isDraft ? 'primary.lightest' : 'sky.lightest',
        ':hover': {
          backgroundColor: !isDraft ? 'primary.alpha30' : 'sky.lighter',
        },
      }}
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%">
      <Stack direction="column" alignItems="flex-start">
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            fontWeight: 'bold',
          }}>
          Chương {index + 1}: {chapter?.title ?? 'Tiêu đề chương'}{' '}
        </Typography>
        <Typography
          color={isDraft ? 'ink.main' : 'ink.main'}
          variant="subtitle2"
          noWrap
          sx={{
            fontWeight: 'normal',
          }}>
          {isDraft ? 'Bản thảo ' : 'Đã đăng tải '}{' '}
          {
            formatDate(chapter.updated_date ?? chapter?.created_date).split(
              ' ',
            )[0]
          }{' '}
        </Typography>
      </Stack>
      {chapter?.price !== 0 ? (
        <Grid xs={1} container justifyContent="flex-start" alignItems="center">
          {chapter?.price} <CurrencyDollarIcon width="1.5em" color="primary" />
        </Grid>
      ) : (
        <></>
      )}
      <Stack
        gap="12px"
        direction="row"
        alignItems="center"
        justifyContent="space-between">
        <Typography fontStyle={'italic'} fontSize="14px">
          {timeAgo(chapter.updated_date)}{' '}
        </Typography>
        <IconButton
          sx={{ marginLeft: '0.2em' }}
          variant="text"
          color="ink.lighter"
          onClick={handleClick}>
          <MoreVert />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}>
          <Grid container direction="column">
            {/* <Button variant="text" color="primary" onClick={() => { handleNavigate() }
                            }>
                                Xem trước
                            </Button> */}
            {chapter.is_draft ? (
              <Button
                variant="text"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onPublishChapter({
                    chapterId: chapter.id,
                    isPublish: true,
                  });
                }}>
                Đăng tải
              </Button>
            ) : (
              <Button
                variant="text"
                color="primary"
                startIcon={
                  <SvgIcon sx={{ width: '18px' }}>
                    <UnpublishedOutlined></UnpublishedOutlined>
                  </SvgIcon>
                }
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (chapter.is_paywalled === true) {
                    handlePaywallDialogOpen();
                  } else {
                    onPublishChapter({
                      chapterId: chapter.id,
                      isPublish: false,
                    });
                  }
                }}>
                Gỡ đăng tải
              </Button>
            )}

            <Button
              variant="text"
              color="secondary"
              startIcon={
                <SvgIcon sx={{ width: '18px' }}>
                  <DeleteForeverOutlined></DeleteForeverOutlined>
                </SvgIcon>
              }
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (chapter.is_paywalled === true) {
                  handlePaywallDialogOpen();
                } else {
                  handleDialogOpen();
                }
              }}>
              Xóa chương
            </Button>

            <ConfirmDialog
              width={'30%'}
              title={`Xác nhận xóa chương ${chapter.title}`}
              actionBgColor="secondary"
              isReverse={true}
              content={
                <Grid container direction="column">
                  {isLast && !chapter.is_draft ? (
                    <Typography>
                      <strong>Hành động này không thể hoàn tác</strong>
                    </Typography>
                  ) : (
                    <></>
                  )}
                  <Typography>
                    Tất cả <strong>lượt đoc</strong> , nội dung sẽ bị{' '}
                    <strong>xóa</strong>
                  </Typography>
                  <Typography>
                    Tất cả <strong>bình luận</strong> , nội dung sẽ bị{' '}
                    <strong>xóa</strong>
                  </Typography>
                  <Typography>
                    Tất cả <strong>bình luận</strong> , nội dung sẽ bị{' '}
                    <strong>xóa</strong>
                  </Typography>
                  {isLast && !chapter.is_draft ? (
                    <Typography>
                      <strong>Truyện cũng sẽ bị xóa</strong>
                    </Typography>
                  ) : (
                    <></>
                  )}
                </Grid>
              }
              isOpen={isOpen}
              handleClose={(isConfirm) => {
                handleDialogClose(isConfirm);
              }}
              actionContent="Xác nhận xóa"
              cancelContent="Hủy thao tác"
            />

            <ConfirmDialog
              width={'30%'}
              title={`Không thể thực hiện hành động này trên chương ${chapter.title}`}
              actionBgColor="secondary"
              content={
                <Grid container direction="column">
                  <Typography>
                    <strong>Không thể gỡ đăng tải</strong> chương trả phí
                  </Typography>
                  <Typography>
                    <strong>Không thể xóa</strong> chương trả phí
                  </Typography>
                </Grid>
              }
              isOpen={isPaywallOpen}
              handleClose={() => {
                handlePaywallDialogClose();
              }}
              actionContent="Tôi đã hiểu"
              cancelContent="Bỏ qua"
            />
          </Grid>
        </Popover>
      </Stack>
    </Stack>
  );
};
const ChapterListTab = ({ list, storyId, refetch }) => {
  const router = useRouter();
  const requestHeader = useRequestHeader();

  const handleCreateChapter = async () => {
    const body = {
      position: list.length + 1,
      story_id: storyId,
    };
    try {
      await new ChapterService(requestHeader).create(body).then(async (res) => {
        // refetch(true);

        // toastSuccess("Tạo chương mới thành công");
        await router.push(`${router.asPath}/write/${res.id}`);
      });
    } catch (error) {
      toastError('Tạo chương không thành công');
    }
  };

  const [page, setPage] = useState(1);

  const chapters = useMemo(() => {
    return list.slice((page - 1) * 10, page * 10);
  }, [page, list]);
  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleCreateChapter();
        }}
        sx={{ height: '3em' }}
        variant="contained"
        startIcon={
          <SvgIcon>
            <AddRounded />
          </SvgIcon>
        }>
        <Typography variant="subtitle1">Tạo chương mới</Typography>
      </Button>
      <Stack width={'100%'} gap={'8px'}>
        {chapters.map((chapter, index) => (
          <Stack width={'100%'} key={index}>
            <ChapterCard
              chapter={chapter}
              index={page !== 1 ? (page - 1) * 10 + index : index}
              storyId={storyId}
              refetch={refetch}
              length={list.length}
            />
          </Stack>
        ))}
      </Stack>
      <Stack alignItems="center" width="100%" sx={{ marginTop: 1 }}>
        <Pagination
          page={page}
          onChange={(e, page) => setPage(page)}
          count={Math.ceil(list.length / 10)}></Pagination>
      </Stack>
    </>
  );
};

export default ChapterListTab;
