import NextLink from 'next/link';

import { Typography } from '@mui/material';

export default function AppIcon({ size = 26, sx, href = '/' }) {
  return (
    <Typography
      href={href}
      component={NextLink}
      variant="h1"
      sx={{
        background: '-webkit-linear-gradient(#439A97, #33FFF8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: size,
        ...sx,
        // color: theme.palette.primary.main,
      }}>
      Audiory
    </Typography>
  );
}
