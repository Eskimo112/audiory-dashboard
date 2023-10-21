import { alpha } from '@mui/material/styles';

const withAlphas = (color) => {
  return {
    ...color,
    alpha10: alpha(color.main, 0.1),
    alpha20: alpha(color.main, 0.2),
    alpha30: alpha(color.main, 0.3),
    alpha40: alpha(color.main, 0.4),
    alpha50: alpha(color.main, 0.5),
    alpha60: alpha(color.main, 0.6),
    alpha70: alpha(color.main, 0.7),
    alpha80: alpha(color.main, 0.8),
    alpha90: alpha(color.main, 0.9),
  };
};

export const sky = withAlphas({
  dark: '#979C9E',
  main: '#CDCFD0',
  light: '#E3E5E5',
  lighter: '#E3E5E5',
  lightest: '#F5F5F5',
});

export const ink = withAlphas({
  darkest: '#090A0A',
  darker: '#202325',
  dark: '#303437',
  main: '#404446',
  light: '#6C7072',
  lighter: '#72777A',
});

export const primary = withAlphas({
  lightest: '#D9EBEA',
  light: '#69AEAC',
  main: '#439A97',
  dark: '#69AEAC',
  darkest: '#367B79',
  contrastText: '#F5F5F5',
});

export const chart = {
  main: '#439A97',
  light: '#A2E4E2',
  darkest: '#0F4F4D',
};

export const secondary = withAlphas({
  lightest: '#F4C8C7',
  lighter: '#E9918F',
  light: '#E26D69',
  main: '#DB6244',
  dark: '#AF3A36',
});

export const success = withAlphas({
  lightest: '#F0FDF9',
  light: '#3FC79A',
  main: '#33CA7F',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF',
});

export const info = withAlphas({
  lightest: '#ECFDFF',
  light: '#CFF9FE',
  main: '#06AED4',
  dark: '#0E7090',
  darkest: '#164C63',
  contrastText: '#FFFFFF',
});

export const warning = withAlphas({
  lightest: '#FFFAEB',
  light: '#FEF0C7',
  main: '#caac33',
  dark: '#B54708',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF',
});

export const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#DB5461',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF',
});
