import { formatNumber } from '../../utils/format-price';

export const getLineChartCommonOptions = (theme, category, series) => {
  return {
    grid: {
      containLabel: true,
      left: 15,
      top: 10,
      right: 10,
      bottom: 15,
    },
    xAxis: {
      type: 'category',
      data: category,
      axisPointer: {
        show: true,
        handle: {
          show: false,
        },
        label: {
          show: false,
        },
        triggerTooltip: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: theme.palette.ink.light,
        },
      },
      axisLabel: {
        color: theme.palette.text[1],
        margin: 16,
        fontSize: 12,
        lineHeight: 14,
        width: 80,
        overflow: 'truncate',
        hideOverlap: true,
        interval: 0,
        rich: {
          cur_label: {
            fontSize: 12,
            lineHeight: 18,
          },
          past_label: {
            color: theme.palette.text[3],
            fontSize: 12,
            lineHeight: 18,
          },
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: theme.palette.ink.light,
        },
      },
      axisLabel: {
        color: theme.palette.text[1],
        fontSize: 12,
        lineHeight: 12,
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.sky.alpha30,
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        snap: true,
        lineStyle: {
          color: theme.palette.sky.main,
          type: [1, 3],
          cap: 'round',
        },
      },
      valueFormatter: (value) => {
        return formatNumber(value) + 'đ';
      },
      show: true,
      triggerOn: 'mousemove',
      enterable: true,
      appendToBody: true,
      showDelay: 1,
      padding: [8, 12],
      borderRadius: 10,
      extraCssText: `box-shadow: ${theme.shadows[1]};border:0;`,
      textStyle: {
        fontFamily: 'Source Sans 3',
        fontSize: 14,
        fontWeight: 600,
      },
    },

    color: Object.values(theme.palette.chart),
    dataZoom: [{ show: false }],
    legend: {
      show: true,
    },
    series: series.map((sr) => ({
      ...sr,
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series',
      },
      symbolSize: 8,
      symbol: 'circle',
      showSymbol: false,
      triggerLineEvent: true,
      lineStyle: {
        width: 3,
      },
    })),
  };
};

export const getBarChartCommonOptions = (theme, category, series) => ({
  grid: {
    containLabel: true,
    left: 15,
    top: 10,
    right: 30,
    bottom: 15,
  },
  xAxis: {
    type: 'value',
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
      lineStyle: {},
    },
    axisLabel: {
      color: theme.palette.text[1],
      margin: 16,
      fontSize: 10,
      lineHeight: 12,
      hideOverlap: true,
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: theme.palette.text[1],
      fontSize: 10,
      lineHeight: 12,
      hideOverlap: true,
      width: 80,
      overflow: 'truncate',
      interval: 0,
    },
    splitLine: {
      lineStyle: {
        color: theme.palette.sky.alpha30,
      },
    },
    type: 'category',
    data: category,
    inverse: true,
  },
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    enterable: true,
    show: true,
    showDelay: 1,
    appendToBody: true,
    axisPointer: {
      type: 'none',
    },
    padding: [8, 12],
    borderRadius: 10,
    extraCssText: `box-shadow: ${theme.shadows[1]};border:0;`,
    textStyle: {
      fontFamily: 'Source Sans 3',
      fontSize: 14,
      fontWeight: 600,
    },
    dataZoom: [
      {
        yAxisIndex: 0,
        orient: 'vertical',
        width: 8,
        maxValueSpan: 6,
        right: 0,
        type: 'slider',
        zoomLock: true,
        showDetail: false,
        showDataShadow: false,
        brushSelect: false,
        handleSize: '300%',
        handleIcon:
          'path://M 5 10 C 5 5 9 0 15 0 L 54 0 C 60 0 64 5 64 10 M 64 10 C 64 16 60 20 55 20 L 15 20 C 9 20 5 16 5 10',
        handleStyle: {
          color: theme.palette.ink.lighter,
          borderColor: 'transparent',
          opacity: 1,
        },
        fillerColor: theme.palette.ink.lighter,
        backgroundColor: theme.palette.sky.alpha30,
        borderColor: 'transparent',

        moveHandleStyle: {
          opacity: 0,
        },

        emphasis: {
          handleStyle: {
            color: theme.palette.ink.lighter,
            borderWidth: 0,
          },
        },
      },
      {
        type: 'inside',
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        preventDefaultMouseMove: false,
        // zoomLock: true,
      },
    ],
  },
  color: Object.values(theme.palette.chart),

  series: series.map((sr) => ({
    ...sr,
    type: 'bar',
    itemStyle: {
      borderRadius: 4,
    },
    emphasis: {
      itemStyle: {
        opacity: 0.5,
      },
      // focus: 'series',
    },
    barWidth: 25,
  })),
});

export const getPieChartCommonOptions = (theme, series) => {
  return {
    series: {
      data: [
        ...series,
        {
          // make an record to fill the bottom 50%
          value: series.reduce((prev, curr) => prev + curr.value, 0),
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none',
            },
          },
          label: {
            show: false,
          },
        },
      ],
      type: 'pie',
      // radius: '80%',
      radius: ['40%', '75%'],
      center: ['50%', '60%'],
      startAngle: 180,

      label: {
        show: false,
      },
      emphasis: {
        scale: false,
        focus: 'self',
      },
    },

    legend: {
      inactiveColor: theme.palette.ink.lighter,
      padding: [10, 0],
      // show: false,
      type: 'scroll',
      orient: 'horizontal',
      top: 200,
      left: 'center',
      itemWidth: 16,
      itemHeight: 16,
      itemGap: 16,
      icon: 'circle',
      textStyle: {
        fontSize: '14px',
        fontFamily: 'Source Sans 3',
        width: 95,
        overflow: 'truncate',
      },
    },
    tooltip: {
      show: true,
      appendToBody: true,
      trigger: 'item',
      formatter: (params) => {
        const { name, marker, value } = params;
        return (
          `<div style="display:flex; flex-direction:column; gap:8px;">` +
          `<div style="display:flex; flex-direction:row; gap:0px;">${marker}` +
          `<span style="font-size:10px;line-height:12px;color:${theme.palette.text[2]}">${name}</span>` +
          `</div>` +
          `<div style="display:flex; flex-direction:column; gap:4px;">` +
          `<div style="font-size:14px;line-height:18px;font-weight:500;color:${
            theme.palette.text[0]
          }">${formatNumber(value)}%</div>` +
          `</div>` +
          `</div>`
        );
      },
      padding: [8, 12],
      borderRadius: 10,
      extraCssText: `box-shadow: ${theme.shadows[1]};border:0;`,
      textStyle: {
        fontFamily: 'Source Sans 3',
      },
    },
    color: Object.values(theme.palette.chart),
  };
};
