import { useCallback, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';

import { TopNav } from './top-nav';
import AuthorBreadcrum from './bread-crum';
import { useRouter } from 'next/router';

const SIDE_NAV_WIDTH = 0;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
    },
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
});

export const Layout = withAuthGuard((props) => {
    const { children } = props;
    const pathname = usePathname();
    const [openNav, setOpenNav] = useState(false);
    const router = useRouter();

    const handlePathnameChange = useCallback(() => {
        if (openNav) {
            setOpenNav(false);
        }
    }, [openNav]);

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname],
    );

    return (
        <>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            {router.pathname === '/author-dashboard' ? <></> : <AuthorBreadcrum />}
            <LayoutRoot>
                <LayoutContainer>{children}</LayoutContainer>
            </LayoutRoot>
        </>
    );
});
