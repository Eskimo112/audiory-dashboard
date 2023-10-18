import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';

export const FilterChip = (props) => {
  const { text, onDelete } = props;

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        padding: '4px 8px',
        borderRadius: '8px',
        background: theme.palette.primary.main,
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
      })}>
      <Typography
        variant="body2"
        fontSize="13px"
        fontWeight={600}
        color="primary.contrastText">
        {text}
      </Typography>
      <Avatar
        onClick={onDelete}
        sx={{
          backgroundColor: 'sky.lightest',
          height: 16,
          width: 16,
          cursor: 'pointer',
        }}>
        <SvgIcon sx={{ width: '8px', color: 'primary.main', strokeWidth: 3 }}>
          <XMarkIcon strokeWidth={3}></XMarkIcon>
        </SvgIcon>
      </Avatar>
    </Box>
  );
};
