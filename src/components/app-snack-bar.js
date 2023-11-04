import React from 'react';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { SnackbarContent } from 'notistack';

export const AppSnackBar = React.forwardRef(function AppSnackBar(
  { message, icon },
  ref,
) {
  return (
    <SnackbarContent ref={ref}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="8px"
        padding="14px 16px"
        borderRadius="8px"
        // width="100%"
        margin="0 auto"
        sx={{
          bgcolor: 'neutral.7',
          boxShadow:
            '2px 6px 12px rgba(0, 0, 0, 0.12), 0px 0px 4px rgba(5, 43, 97, 0.12)',
        }}>
        {icon}
        <Typography variant="body1" color="#000">
          {message}
        </Typography>
      </Box>
    </SnackbarContent>
  );
});
