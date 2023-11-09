import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { formatPrice } from '@/utils/formatters';

export const OverviewTotalProfit = (props) => {
  const { sx } = props;
  const { data: total = 0, isLoading } = useQuery(['profit'], async () => {
    const res = await axios.get(
      'https://pricible.azurewebsites.net/api/Order/getTotalProfit',
    );
    return res.data;
  });

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Tổng doanh thu
            </Typography>
            <Typography variant="h4">
              {isLoading ? '...' : formatPrice(Math.round(total))}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56,
            }}>
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
