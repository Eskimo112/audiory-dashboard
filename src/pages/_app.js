import * as React from 'react';

import Head from 'next/head';

import 'simplebar-react/dist/simplebar.min.css';

import { CacheProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';

import { AppSnackBar } from '../components/app-snack-bar';

const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Audiory dashboard</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            maxSnack={3}
            Components={{ custom: AppSnackBar }}
            autoHideDuration={3000}
            preventDuplicate>
            <MantineProvider>
              <AuthProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <AuthConsumer>
                    {(auth) =>
                      auth.isLoading ? (
                        <SplashScreen />
                      ) : (
                        getLayout(<Component {...pageProps} />)
                      )
                    }
                  </AuthConsumer>
                </ThemeProvider>
              </AuthProvider>
            </MantineProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default App;
