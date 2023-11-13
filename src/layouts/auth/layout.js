import Image from 'next/image';
import NextLink from 'next/link';

import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import PropTypes from 'prop-types';

import AppIcon from '@/components/app-icon';

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto',
      }}>
      <Grid container sx={{ flex: '1 1 auto' }}>
        <Grid xs={12} lg={6}>
          <Box sx={{ p: 12 }}>
            <Image
              src={'/assets/images/login_cover.png'}
              alt={'girl reading book under a tree'}
              width={0}
              height={0}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
          </Box>
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%',
            }}>
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32,
                textDecoration: 'none',
              }}>
              <AppIcon />
            </Box>
          </Box>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
