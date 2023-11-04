import React, { useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Breadcrumbs, Typography } from '@mui/material';

const ROUTE_NAME_MAP = {
  '/': 'Tổng quan',
  '/users': 'Người dùng',
  '/users/[user_id]': 'Chi tiết người dùng',
  '/reports': 'Báo cáo',
  '/reports/[report_id]': 'Chi tiết báo cáo',
  '/reports/create': 'Tạo báo cáo mới',
};

const AppBreadCrumbs = () => {
  const router = useRouter();
  const paths = router.asPath.slice(1).split('/');
  const routes = router.route.slice(1).split('/');

  const breadcrums = useMemo(() => {
    const result = [];
    let accumulativeLink = '';
    let accumulativeRoute = '';

    paths.forEach((path, index) => {
      if (index !== 0) {
        result.push(
          <Link
            key={index}
            href={accumulativeLink}
            style={{ textDecoration: 'none' }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: 'ink.main',
                ':hover': {
                  textDecoration: 'underline',
                },
              }}>
              {ROUTE_NAME_MAP[accumulativeRoute]}
            </Typography>
          </Link>,
        );
      }
      accumulativeLink += '/' + path;
      accumulativeRoute += '/' + routes[index];
    }, '/');

    result.push(
      <Typography
        variant="body1"
        sx={{ fontSize: '16px', color: 'ink.lighter' }}>
        {ROUTE_NAME_MAP[accumulativeRoute]}
      </Typography>,
    );
    return result;
  }, [paths, routes]);

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadcrums}
    </Breadcrumbs>
  );
};

export default AppBreadCrumbs;
