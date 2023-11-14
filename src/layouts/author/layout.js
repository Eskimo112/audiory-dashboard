import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import { styled } from '@mui/material/styles';
import path from 'path';
import { withAuthGuard } from 'src/hocs/with-auth-guard';

import AuthorBreadcrum from './bread-crum';
import { TopNav } from './top-nav';
import AuthorBreadCrumbs from '@/components/author-bread-crumbs';

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
            <LayoutRoot>
                <LayoutContainer>{children}</LayoutContainer>
            </LayoutRoot>
        </>
    );
});