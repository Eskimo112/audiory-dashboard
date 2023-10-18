import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Box, debounce } from '@mui/material';
import { getInstanceByDom, init } from 'echarts';

const DEFAULT_OPTIONS = {
  textStyle: {
    fontFamily: 'Source Sans 3',
    fontWeight: 600,
  },
};

const SAFE_RESIZE_DEBOUNCE_MS = 5000;

export default function AppChart({
  option,
  settings,
  loading,
  onEvent,
  onChartDomChange,
  onWidthChange,
  width = '100%',
  height = '100%',
  renderMode = 'svg',
  ...rest
}) {
  const chartRef = useRef(null);

  const getChartInstance = useCallback(() => {
    if (chartRef.current == null) {
      return null;
    }

    return getInstanceByDom(chartRef.current);
  }, []);

  useEffect(() => {
    // Initialize chart
    let chart;
    if (chartRef.current != null) {
      if (onWidthChange) onWidthChange(chartRef.current.clientWidth);
      chart = init(chartRef.current, undefined, { renderer: renderMode });
      if (onEvent)
        onEvent.forEach((e) => {
          if (e.query)
            chart?.on(e.name, e.query, (params) => e.handler(chart, params));
          else chart?.on(e.name, (params) => e.handler(chart, params));
        });
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChartOnWindowSizeChanges() {
      if (onWidthChange) onWidthChange(chartRef.current?.clientWidth ?? 0);
      chart?.resize();
    }

    window.addEventListener('resize', resizeChartOnWindowSizeChanges);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChartOnWindowSizeChanges);
    };
  }, [width, height, onEvent, onWidthChange, renderMode]);

  useEffect(() => {
    if (!chartRef.current || !onChartDomChange) return;
    onChartDomChange(chartRef.current);
  }, [onChartDomChange, chartRef]);

  useEffect(() => {
    // Update chartxw
    const chart = getChartInstance();
    chart?.setOption({ ...DEFAULT_OPTIONS, ...option }, settings);
  }, [option, settings, getChartInstance]);

  useEffect(() => {
    // Update chart
    const chart = getChartInstance();
    loading === true ? chart?.showLoading() : chart?.hideLoading();
  }, [loading, getChartInstance]);

  const resizeHandler = useMemo(
    () =>
      debounce((width, height) => {
        if (!width || !height) return;
        const chart = getChartInstance();
        chart?.resize({
          width: Number(width),
          height: Number(height),
        });
      }, SAFE_RESIZE_DEBOUNCE_MS),
    [getChartInstance],
  );

  // NOTE: resize chart listeners
  useEffect(() => {
    const widthPx = Number(width);
    const heightPx = Number(height);

    if (!width || !height || Number.isNaN(widthPx) || Number.isNaN(heightPx)) {
      return;
    }

    resizeHandler(widthPx, heightPx);
  }, [width, height, resizeHandler]);

  // useEffect(() => {
  //   const chart = getChartInstance();
  //   if (!chart) return;
  //   chart.on('datazoom', (params) => {
  //     console.log(params);
  //   });
  // }, [chartRef]);

  return (
    <>
      <Box
        ref={chartRef}
        width={width}
        height={height}
        // flexGrow="1"
        // display="f"
        {...rest}
        sx={{
          '#tooltip': {
            '&::-webkit-scrollbar': {
              width: '4px',
              height: '4px', // NOTE: for horizontal scrollbar
              borderRadius: ' 8px',
              backgroundColor: (theme) => theme.palette.sky.main,
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '4px',
              backgroundColor: (theme) => theme.palette.sky.main,
            },
          },
        }}
      />
    </>
  );
}

// export default memo(AppChart);
