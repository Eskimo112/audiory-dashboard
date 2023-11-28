import React, { useMemo, useState } from 'react';

import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useInfiniteQuery } from 'react-query';

import AppComment from '../../../components/app-comment';
import CommentService from '../../../services/comment';

const ParaCommentDialog = ({ paraId, onClose, open }) => {
  const [sortBy, setSortBy] = useState('vote_count');
  const {
    data: comments = [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['comments', paraId],
    ({ pageParam }) =>
      new CommentService().getByParaId(paraId, pageParam, 10, sortBy),
    {
      enabled: !!paraId,
      getNextPageParam: (lastPage, pages) => {
        return pages.length;
      },
    },
  );
  const content = useMemo(() => {
    if (error)
      return (
        <Typography variant="body1">Có lỗi xảy ra, thử lại sau</Typography>
      );
    if (!comments.pages || comments.pages.length === 0)
      return <Typography variant="body1">Không có bình luận</Typography>;

    return (
      <>
        {comments &&
          comments.map((cmt, index) => (
            <AppComment comment={cmt} key={index} />
          ))}
        {!hasNextPage ||
          (isFetchingNextPage && (
            <Button variant="outline" onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
            </Button>
          ))}
      </>
    );
  }, [comments, error, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: '500px',
          maxHeight: '90%',
          borderRadius: 3,
        },
      }}
      onClose={onClose}
      open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Bình luận đoạn</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={(onClose = { onClose })}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}>
        <Close />
      </IconButton>
      <DialogContent dividers>{content}</DialogContent>
    </Dialog>
  );
};

export default ParaCommentDialog;
