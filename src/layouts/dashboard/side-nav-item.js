import NextLink from 'next/link';

import { Box, ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, open } = props;

  const linkProps = path
    ? external
      ? {
          component: 'a',
          href: path,
          target: '_blank',
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: open ? '16px' : '8px',
          pr: open ? '16px' : '8px',
          py: '10px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'primary.alpha10',
          }),
          '&:hover': {
            backgroundColor: active ? 'primary.alpha20' : 'ink.alpha10',
          },
        }}
        {...linkProps}>
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'ink.lighter',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main',
              }),
            }}>
            {icon}
          </Box>
        )}
        {open && (
          <Box
            component="span"
            sx={{
              color: 'ink.lighter',
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '24px',
              whiteSpace: 'nowrap',
              ...(active && {
                color: 'primary.main',
              }),
              ...(disabled && {
                color: 'ink.lighter',
              }),
            }}>
            {title}
          </Box>
        )}
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};
