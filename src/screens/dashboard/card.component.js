import ChevronDoubleUpIcon from '@heroicons/react/24/solid/ChevronDoubleUpIcon';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

import { formatNumber } from '../../utils/format-price';

export const StatCard = (props) => {
  const { difference, positive = false, sx, value, title, icon } = props;

  return (
    <Card sx={{ ...sx, padding: 0 }}>
      <CardContent sx={{ padding: '24px', paddingBottom: '24px!important' }}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}>
          <Stack spacing={1.5}>
            <Typography
              color="ink.main"
              sx={{ fontWeight: 600, fontSize: '14px' }}>
              {title}
            </Typography>
            {difference ? (
              <Typography
                color="ink.main"
                sx={{ fontWeight: 600, fontSize: '16px' }}>
                <SvgIcon sx={{ marginBottom: '-6px', color: 'success.main' }}>
                  <ChevronDoubleUpIcon width="16px" />
                </SvgIcon>
                {`${positive ? '+' : '-'}${formatNumber(difference)}%`}
              </Typography>
            ) : (
              <Box></Box>
            )}
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {formatNumber(value)}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              background: '-webkit-linear-gradient(#439A97, #33FFF8)',
              height: 40,
              width: 40,
            }}>
            <SvgIcon sx={{ width: '18px' }}>{icon}</SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

StatCard.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.string,
};
