import PropTypes from "prop-types";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";

export const OverviewTasksProgress = (props) => {
  const { value, sx } = props;

  const { data: view = 0, isLoading } = useQuery(["view"], async () => {
    const res = await axios.get("https://pricible.azurewebsites.net/api/Visit");
    return res.data;
  });

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Lượt xem trang
            </Typography>
            <Typography variant="h4">{isLoading ? "..." : view}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <EyeIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {/* <Box sx={{ mt: 3 }}>
          <LinearProgress value={value} variant="determinate" />
        </Box> */}
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
