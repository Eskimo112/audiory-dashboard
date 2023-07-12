import PropTypes from "prop-types";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import { useQuery } from "react-query";
import axios from "axios";

export const OverviewBudget = (props) => {
  const { difference, positive = false, sx, value } = props;
  const { data: order = [] } = useQuery(["order"], async () => {
    const res = await axios.get("https://pricible.azurewebsites.net/api/Order", {
      params: {
        pageSize: 100000,
      },
    });
    return res.data.data;
  });
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Đơn hàng
            </Typography>
            <Typography variant="h4">{order.length}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ShoppingBagIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              Since last month
            </Typography> */}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
