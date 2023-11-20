import { Box } from '@mui/material';
import axios from 'axios';
import Lottie from 'react-lottie';
import { useQuery } from 'react-query';

import { useRequestHeader } from '../hooks/use-request-header';
import { request } from '../services/__base';

export const AppLottie = ({ url, width, height }) => {
  const { data, isLoading } = useQuery([url], () => axios.get(url));
  if (isLoading) return <></>;
  if (!data.data) return <></>;
  console.log(data.data);
  return (
    <Box width={width || '100%'} height={height || '100%'}>
      <Lottie options={{ animationData: data.data, loop: true }} />
    </Box>
  );
};
