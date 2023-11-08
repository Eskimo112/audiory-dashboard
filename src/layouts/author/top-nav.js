import { useState } from 'react';

import { useRouter } from 'next/router';

import { BarChart, ChatBubbleOutline, Edit, NotificationsNone, Search } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { usePopover } from 'src/hooks/use-popover';

import AppIcon from '@/components/app-icon';
import { useAuth } from '@/hooks/use-auth';

import { AccountPopover } from '../dashboard/account-popover';


const TOP_NAV_HEIGHT = 60;

export const TopNav = (props) => {
    // const { onNavOpen } = props;
    // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const router = useRouter();
    const accountPopover = usePopover();
    const auth = useAuth();
    console.log(auth)
    const [user, setUser] = useState(auth?.user);
    return (
        <>
            <Box
                component="header"
                xs={{ flexGrow: 1 }}
                sx={{
                    px: 2,
                    backdropFilter: 'blur(6px)',
                    backgroundColor: (theme) =>
                        alpha(theme.palette.sky.lightest, 0.2),
                    position: 'sticky',
                    top: 0,
                    borderBottom: 0.5,
                    height: TOP_NAV_HEIGHT,
                    borderColor: (theme) =>
                        alpha(theme.palette.sky.light, 1),
                    zIndex: (theme) => theme.zIndex.appBar,
                }}
            >
                <Grid sx={{ height: TOP_NAV_HEIGHT }} justifyContent="space-between" alignItems="center" container>
                    <Grid item xs={3}>
                        <AppIcon />
                    </Grid>
                    <Grid item xs="auto" justifyContent="center" container direction="row" alignItems="center" alignContent="center">
                        {/* <Button startIcon={<SendIcon />} variant="text" color="primary">
                            Khám phá
                        </Button> */}
                        <Button startIcon={<BarChart />} variant={router.pathname.startsWith('/author-dashboard') ? 'contained' : 'text'} color="primary" onClick={() => { router.push('/author-dashboard') }}>
                            Thống kê
                        </Button>
                        <Button startIcon={<Edit />} variant={router.pathname.startsWith('/my-works') ? 'contained' : 'text'} color="primary" onClick={() => { router.push('/my-works') }}>
                            Sáng tác
                        </Button>
                    </Grid>
                    <Grid item xs={3} container alignItems="center" >
                        <Grid item xs>
                            <IconButton aria-label="delete" size="medium" >
                                <Search fontSize="inherit" />
                            </IconButton></Grid>
                        <Grid item xs>
                            <IconButton aria-label="delete" size="medium" >
                                <NotificationsNone fontSize="inherit" />
                            </IconButton></Grid>
                        <Grid item xs>
                            <IconButton aria-label="delete" size="medium" >
                                <ChatBubbleOutline fontSize="inherit" />
                            </IconButton></Grid>
                        <Grid item xs={6} container direction="row" alignItems="center">
                            <Grid item xs={3}><Avatar
                                onClick={accountPopover.handleOpen}
                                ref={accountPopover.anchorRef}
                                sx={{
                                    cursor: 'pointer',
                                    height: 40,

                                }}
                                src={auth?.user?.avatar_url ?? ''}
                            /></Grid>
                            <Grid item xs="auto" container direction="column" justifyContent="space-around" >
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle2" component="div">
                                        {auth?.user?.username ?? ''}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        {auth?.user?.full_name ?? ''}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Box >
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
