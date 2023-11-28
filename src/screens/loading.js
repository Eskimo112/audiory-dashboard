import React from 'react';

import Head from 'next/head';

import { Box, CircularProgress } from '@mui/material';

import { SHARED_PAGE_SX } from '../constants/page_sx';

const LoadingPage = () => {
  return (
    <>
      <Head>
        <title>Loading </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center">
          <CircularProgress></CircularProgress>
        </Box>
      </Box>
      ;
    </>
  );
};

export default LoadingPage;
