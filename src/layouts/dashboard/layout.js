import { useState } from 'react';

import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';

import { SideNav } from './side-nav';
import { TopNav } from './top-nav';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme, open }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingLeft: open ? SIDE_NAV_WIDTH : 54,
  transition: 'padding 0.5s',
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onSwitch={() => setOpenNav(!openNav)} open={openNav} />
      <LayoutRoot open={openNav}>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});
