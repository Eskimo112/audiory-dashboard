import { formatNumber } from '../../utils/formatters';

export const getAuthorChartCommonOptions = (theme, category, series) => ({
  grid: {
    containLabel: true,
    left: 15,
    top: 10,
    right: 30,
    bottom: 15,
  },
  xAxis: {
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
  yAxis: {
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
});

export const getAuthorPieChartCommonOptions = (theme, series) => {
  return {
    series: {
      data: [...series],
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['70%', '50%'],

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
      orient: 'vertical',
      left: 50,
      top: 'center',
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
          }">${formatNumber(value)}</div>` +
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
