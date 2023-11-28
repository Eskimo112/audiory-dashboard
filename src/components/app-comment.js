import React from 'react';

import { MoreVert, ThumbUpOutlined } from '@mui/icons-material';
import { Avatar, Button, Stack, SvgIcon, Typography } from '@mui/material';

import { countDiffenceFromNow } from '../utils/formatters';

const AppComment = ({ comment }) => {
  return (
    <Stack width="100%" gap="6px">
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" gap="8px">
          <Avatar
            src={comment.user.avatar_url}
            sx={{ width: '30px', height: '30px' }}></Avatar>
          <Typography variant="subtitle2">{comment.user.full_name}</Typography>
          <Typography variant="caption" fontWeight={400} fontSize={12}>
            {countDiffenceFromNow(comment.created_date)}
          </Typography>
        </Stack>
        <Button variant="text">
          <SvgIcon sx={{ width: '24px', height: '24px' }}>
            <MoreVert></MoreVert>
          </SvgIcon>
        </Button>
      </Stack>
      <Typography variant="body1">{comment.content}</Typography>
      <Stack direction="row">
        <Button variant="text">
          <SvgIcon sx={{ width: '16px', height: '16px' }}>
            <ThumbUpOutlined></ThumbUpOutlined>
          </SvgIcon>
        </Button>
      </Stack>
    </Stack>
  );
};

export default AppComment;
