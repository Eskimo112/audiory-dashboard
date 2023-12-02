import ChevronDoubleDownIcon from '@heroicons/react/24/solid/ChevronDoubleDownIcon';
import ChevronDoubleUpIcon from '@heroicons/react/24/solid/ChevronDoubleUpIcon';
import {
  Avatar,
  Card,
  CardContent,
  Skeleton,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

import { formatNumber } from '@/utils/formatters';

export const StatCard = (props) => {
  const { difference, sx, value, title, icon, isLoading, isError, suffix } =
    props;
  if (isError) return <></>;
  if (isLoading) return <Skeleton width="270px" height="160px" />;

  let percent = 0;
  if (value !== 0) {
    percent = (difference / value) * 100;
  }
  const positive = difference >= 0;
  return (
    <Card
      sx={{
        ...sx,
        padding: 0,
        backgroundColor: difference
          ? positive
            ? 'primary.alpha20'
            : 'secondary.alpha20'
          : '',
      }}>
      <CardContent sx={{ padding: '24px', paddingBottom: '24px!important' }}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}>
          <Stack spacing={1.5}>
            <Typography
              color="ink.main"
              sx={{ fontWeight: 600, fontSize: '16px' }}>
              {title}
            </Typography>
            {difference && (
              <Typography
                color="ink.main"
                sx={{ fontWeight: 600, fontSize: '16px' }}>
                <SvgIcon
                  sx={{
                    marginBottom: '-6px',
                    color: positive ? 'success.main' : 'error.main',
                  }}>
                  {positive ? (
                    <ChevronDoubleUpIcon width="16px" />
                  ) : (
                    <ChevronDoubleDownIcon width="16px" />
                  )}
                </SvgIcon>
                {formatNumber(percent) + '%'}
              </Typography>
            )}
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatNumber(value) + (suffix || '')}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: difference
                ? positive
                  ? 'primary.main'
                  : 'secondary.main'
                : 'primary.main',
              height: 40,
              width: 40,
            }}>
            <SvgIcon sx={{ width: '20px' }}>{icon}</SvgIcon>
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
  suffix: PropTypes.string,
};
