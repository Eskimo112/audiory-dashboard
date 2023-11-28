import React from 'react';

import { Close } from '@mui/icons-material';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import { useQuery } from 'react-query';

import AppComment from '../../../components/app-comment';
import CommentService from '../../../services/comment';

const CommentDetailDialog = ({ commentId, onClose, open }) => {
  const { data: comment = {}, isLoading } = useQuery(
    ['comments', commentId],
    () => new CommentService().getById(commentId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

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
      <DialogTitle sx={{ m: 0, p: 2 }}>Chi tiết bình luận</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}>
        <Close />
      </IconButton>
      <DialogContent dividers>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Stack gap="12px">
            <AppComment comment={comment} />
            <Stack ml="52px">
              {comment.children.map((cmt, index) => (
                <AppComment key={index} comment={cmt} isChildren />
              ))}
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommentDetailDialog;
