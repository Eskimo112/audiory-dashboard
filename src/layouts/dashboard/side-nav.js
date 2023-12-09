import { usePathname } from 'next/navigation';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { Scrollbar } from 'src/components/scrollbar';

import AppIcon from '@/components/app-icon';

import { items } from './config';
import { SideNavItem } from './side-nav-item';

export const SideNav = (props) => {
  const { open, onSwitch } = props;
  const pathname = usePathname();

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
        },
        '& .simplebar-scrollbar:before': {
          background: 'sky.main',
        },
      }}>
      <Box sx={{ height: '100%' }}>
        <Box sx={{ p: open ? 3 : 1 }}>{open && <AppIcon />}</Box>
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 1,
            py: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
            }}>
            {items.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  open={open}
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
          <IconButton onClick={() => onSwitch()} sx={{ borderRadius: '4px' }}>
            {open ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        </Box>
      </Box>
    </Scrollbar>
  );

  return (
    <Drawer
      anchor="left"
      open={true}
      PaperProps={{
        sx: {
          width: open ? 260 : 54,
          transition: 'width 0.5s',
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="permanent">
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onSwitch: PropTypes.func,
  open: PropTypes.bool,
};
