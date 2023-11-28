import React from 'react';

import { Avatar, Stack, Typography } from '@mui/material';

import { timeAgo } from '../utils/formatters';

const AppComment = ({ comment, isChildren }) => {
  return (
    <Stack width="100%" gap="4px">
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" gap="8px">
          <Avatar
            src={comment.user.avatar_url}
            sx={{
              width: isChildren ? '35px' : '40px',
              height: isChildren ? '35px' : '40px',
            }}></Avatar>
          <Stack>
            <Typography variant="subtitle2">
              {comment.user.full_name}
            </Typography>
            <Typography variant="caption" fontWeight={400} fontSize={12}>
              {timeAgo(comment.created_date)}
            </Typography>
          </Stack>
        </Stack>
        {/* <Button variant="text">
          <SvgIcon sx={{ width: '24px', height: '24px' }}>
            <MoreVert></MoreVert>
          </SvgIcon>
        </Button> */}
      </Stack>
      <Typography variant="body1" fontSize={isChildren ? 16 : 18}>
        {comment.text}
      </Typography>
      <Stack direction="row" gap="12px">
        <Typography variant="body2" fontWeight={600}>
          {comment.like_count ?? 0} lượt thích
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {comment.report_count ?? 0} báo cáo
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {comment.report_count ?? 0} báo cáo
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AppComment;
