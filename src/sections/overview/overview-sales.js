import PropTypes from "prop-types";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { formatPrice } from "../../utils/format-price";
import { useQuery } from "react-query";
import axios from "axios";

const useChartOptions = (weeklyData) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ["#DB5461", "#33CA7F", "#686963"],
    dataLabels: {
      enabled: false,
    },

    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
    },
    plotOptions: {},
    stroke: {
      // colors: ["transparent"],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: weeklyData.map((item) => "week " + item.week),
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        // formatter: (value) => (value > 0 ? `${formatPrice(value)}` : `${formatPrice(value)}`),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};
// {
//   "id": 0,
//   "week": 0,
//   "visits": 0,
//   "userCreated": 0,
//   "orders": 0
// }
export const OverviewSales = (props) => {
  const { sx } = props;

  const { data: weeklyData = [] } = useQuery(["weekly_data"], async () => {
    const res = await axios.get("https://pricible.azurewebsites.net/api/WeekMetric");
    return res.data;
  });

  console.log(weeklyData);

  const chartOptions = useChartOptions(weeklyData);

  let formattedSeries = [
    {
      data: [],
      name: "visit",
    },
    {
      data: [],
      name: "new user",
    },
    {
      data: [],
      name: "orders",
    },
  ];
  weeklyData.forEach((week) => {
    formattedSeries[0].data.push(week.visits);
    formattedSeries[1].data.push(week.userCreated);
    formattedSeries[2].data.push(week.orders);
  });

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            }
          >
            Làm mới
          </Button>
        }
        title="Số liệu theo tuần"
      />
      <CardContent>
        <Chart
          height={350}
          type="line"
          options={chartOptions}
          series={formattedSeries}
          width="100%"
        />
      </CardContent>
      {/* <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          Overview
        </Button>
      </CardActions> */}
    </Card>
  );
};

OverviewSales.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object,
};
