import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';

import {
  chart,
  error,
  info,
  ink,
  primary,
  secondary,
  sky,
  success,
  warning,
} from './colors';

export function createPalette() {
  return {
    action: {
      active: alpha(primary.main, 0.5),
      disabled: alpha(primary.main, 0.38),
      disabledBackground: alpha(primary.main, 0.12),
      focus: alpha(primary.main, 0.16),
      hover: alpha(primary.main, 0.04),
      selected: alpha(primary.main, 0.12),
    },
    background: {
      default: common.white,
      paper: common.white,
    },
    divider: '#F2F4F7',
    error,
    sky,
    chart,
    secondary,
    mode: 'light',
    info,
    ink,
    primary,
    success,
    text: {
      primary: ink.main,
      secondary: ink.light,
      disabled: alpha(ink.main, 0.38),
    },
    warning,
  };
}
