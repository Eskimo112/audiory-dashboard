import { useState } from 'react';

import { useRouter } from 'next/router';

import {
  BarChart,
  Edit,
  FlagOutlined,
  NotificationsNone,
  NotificationsOutlined,
  Person,
} from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { usePopover } from 'src/hooks/use-popover';

import AppIcon from '@/components/app-icon';
import { useAuth } from '@/hooks/use-auth';

import { useRequestHeader } from '../../hooks/use-request-header';
import UserService from '../../services/user';
import { AccountPopover } from '../dashboard/account-popover';

const TOP_NAV_HEIGHT = 60;

export const TopNav = (props) => {
  // const { onNavOpen } = props;
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const router = useRouter();
  const accountPopover = usePopover();
  const { user } = useAuth();
  const requestHeader = useRequestHeader();
  const {
    data: notis = [],
    isLoading,
    refetch,
  } = useQuery(
    ['user', user.id, 'notification', 1],
    async () => await new UserService(requestHeader).getNotificationByUserId(0),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(user.id),
      select: (res) => res.data,
    },
  );
  return (
    <>
      <Box
        component="header"
        sx={{
          px: 2,
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha('#FFF', 0.5),
          position: 'sticky',
          top: 0,
          borderBottom: 0.5,
          height: TOP_NAV_HEIGHT,
          borderColor: (theme) => alpha(theme.palette.sky.light, 1),
          zIndex: (theme) => theme.zIndex.appBar,
        }}>
        <Grid
          sx={{ height: TOP_NAV_HEIGHT }}
          justifyContent="space-between"
          alignItems="center"
          container>
          <Grid item xs={3}>
            <AppIcon href="/my-works" />
          </Grid>
          <Grid
            item
            xs="auto"
            columnGap={1}
            justifyContent="center"
            container
            direction="row"
            alignItems="center"
            alignContent="center">
            {/* <Button startIcon={<SendIcon />} variant="text" color="primary">
                            Khám phá
                        </Button> */}
            <Button
              startIcon={<BarChart />}
              variant={
                router.pathname.startsWith('/author-dashboard')
                  ? 'contained'
                  : 'text'
              }
              color="primary"
              onClick={() => {
                if (!router.pathname.startsWith('/author-dashboard'))
                  router.push('/author-dashboard');
              }}>
              Thống kê
            </Button>
            <Button
              startIcon={<Edit />}
              variant={
                router.pathname.startsWith('/my-works') ? 'contained' : 'text'
              }
              color="primary"
              onClick={() => {
                if (!router.pathname.startsWith('/my-works'))
                  router.push('/my-works');
              }}>
              Sáng tác
            </Button>
            <Button
              startIcon={<Person />}
              variant={
                router.pathname.startsWith('/profile') ? 'contained' : 'text'
              }
              color="primary"
              onClick={() => {
                if (!router.pathname.startsWith('/profile'))
                  router.push('/profile/me');
              }}>
              Hồ sơ
            </Button>
          </Grid>
          <Grid
            item
            xs={3}
            container
            alignItems="center"
            justifyContent="end"
            columnGap={1}>
            <Grid item xs="auto">
              <Tooltip title="Thông báo">
                <IconButton
                  aria-label="delete"
                  size="medium"
                  color="inherit"
                  sx={{ position: 'relative' }}
                  onClick={() => {
                    router.push('/notification-list');
                  }}>
                  <NotificationsOutlined color="primary" />
                  {(notis ?? []).find((noti) => noti.is_read !== true) && (
                    <Stack
                      sx={{
                        width: '6px',
                        height: '6px',
                        bgcolor: 'secondary.main',
                        position: 'absolute',
                        borderRadius: '8px',
                        right: 6,
                        top: 6,
                      }}></Stack>
                  )}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs="auto">
              <Tooltip title="Danh sách báo cáo">
                <IconButton
                  aria-label="delete"
                  size="medium"
                  color="inherit"
                  onClick={() => {
                    router.push('/report-list');
                  }}>
                  <FlagOutlined color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs="auto">
              <Grid
                container
                aria-label="delete"
                alignItems="center"
                size="medium"
                color="inherit"
                onClick={accountPopover.handleOpen}>
                <Avatar
                  ref={accountPopover.anchorRef}
                  sx={{
                    cursor: 'pointer',
                    height: 30,
                    width: 30,
                  }}
                  src={user?.avatar_url ?? ''}
                />
                <ArrowDropDownIcon fontSize="inherit" color="primary" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
